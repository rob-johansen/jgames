import { createServer, IncomingMessage } from 'http'
import { Socket } from 'net'
import WebSocket, { Server } from 'ws'

import { getWaitingPlayers } from '@/data/queries/phase10/waiting'
import { logger } from '@/logger'
import { MessageType } from '@jgames/types'
import type { WebSocketMessage } from '@jgames/types'

type Connection = {
  alive: boolean,
  socket: WebSocket
}

const PORT = 4444

class WebSocketServer {
  private connections = new Map<string, Connection>()
  private wss = new Server({ clientTracking: false, noServer: true })

  constructor() {
    // Listen for `connection` events after the HTTP upgrade.
    this.wss.on('connection', async (socket: WebSocket, _req: IncomingMessage, game: string, userId: string) => {
      let connection: Connection | null = {
        alive: true,
        socket
      }

      socket.on('pong', () => {
        if (connection) {
          connection.alive = true
        }
      })

      socket.on('close', () => {
        this.connections.delete(userId)
        connection = null
      })

      this.connections.set(userId, connection)

      // TODO: Eventually you'll need to use `game` to determine which waiting players to look up.

      this.sendToAll({
        data: {
          players: (await getWaitingPlayers()).map(({ name }) => name)
        },
        type: MessageType.JOIN
      })
    })

    // Start the interval timer for pinging clients every 30 seconds.
    const intervalId = setInterval(() => {
      for (const connection of this.connections.values()) {
        if (!connection.alive) {
          return connection.socket.terminate()
        }
        connection.alive = false
        connection.socket.ping()
      }
    }, 30_000)

    // Stop the interval timer when the WebSocketServer is closed.
    this.wss.on('close', (): void => {
      clearInterval(intervalId)
    })

    // Set up the HTTP server that will listen for upgrade requests.
    const http = createServer()

    http.on('upgrade', async (req: IncomingMessage, socket: Socket, head: Buffer): Promise<void> => {
      try {
        const url = new URL(req.url || '', `http://${req.headers.host}`)
        const game = url.searchParams.get('game')
        const userId = url.searchParams.get('userId')

        if (game && userId) {
          // Check if there's an open websocket connection already for this user.
          if (this.connections.get(userId)) {
            socket.write('HTTP/1.1 409 Conflict\r\n\r\n')
            socket.destroy()
            return
          }
          this.wss.handleUpgrade(req, socket, head, (socket): void => {
            this.wss.emit('connection', socket, req, game, userId)
          })
        }
      } catch (err) {
        logger.error(err)
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
      }
    })

    http.listen(PORT)
    logger.info(`jGames WebSocketServer listening for HTTP upgrade on ${PORT}`)
  }

  sendToAll = (message: WebSocketMessage): void => {
    for (const connection of this.connections.values()) {
      connection.socket.send(JSON.stringify(message))
    }
  }

  sendToPlayer = (userId: string, message: WebSocketMessage): void => {
    const connection = this.connections.get(userId)
    if (connection) {
      connection.socket.send(JSON.stringify(message))
    }
  }
}

export const wss = new WebSocketServer()

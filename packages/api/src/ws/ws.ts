import { createServer, IncomingMessage } from 'http'
import { Socket } from 'net'
import WebSocket, { WebSocketServer } from 'ws'

import { logger } from '@/logger'

type Connection = {
  alive: boolean,
  socket: WebSocket
}

const PORT = 4444

/**
 * Global map of user IDs and corresponding WebSocket connections
 */
export const connections = new Map<string, Connection>()

export const start = async (): Promise<void> => {
  const wss = new WebSocketServer({ clientTracking: false, noServer: true })

  // Listen for `connection` events after the HTTP upgrade.
  wss.on('connection', (socket: WebSocket, _req: IncomingMessage, userId: string) => {
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
      connections.delete(userId)
      connection = null
    })

    connections.set(userId, connection)
  })

  // Start the interval timer for pinging clients every 30 seconds.
  const intervalId = setInterval(() => {
    for (const connection of connections.values()) {
      if (!connection.alive) {
        return connection.socket.terminate()
      }
      connection.alive = false
      connection.socket.ping()
    }
  }, 30_000)

  // Stop the interval timer when the WebSocketServer is closed.
  wss.on('close', (): void => {
    clearInterval(intervalId)
  })

  // Set up the HTTP server that will listen for upgrade requests.
  const http = createServer()

  http.on('upgrade', async (req: IncomingMessage, socket: Socket, head: Buffer): Promise<void> => {
    try {
      const url = new URL(req.url || '', `http://${req.headers.host}`)

      // TODO and WYLO:
      //   1. Do you also need the name of the game as a search parameter?
      //   2. How should the API server send messages via the WebSocketServer?
      const userId = url.searchParams.get('userId')

      if (userId) {
        // Check if there's an open websocket connection already for this user.
        if (connections.get(userId)) {
          socket.write('HTTP/1.1 409 Conflict\r\n\r\n')
          socket.destroy()
          return
        }
        wss.handleUpgrade(req, socket, head, (socket): void => {
          wss.emit('connection', socket, req, userId)
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

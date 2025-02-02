import { MessageType } from './MessageType'

export type WebSocketMessage = {
  data: Record<string, unknown>
  type: MessageType
}

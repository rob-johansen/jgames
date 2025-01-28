import type { ApiRequest } from './ApiRequest'

export type PostRequest<T = Record<string, never>> = ApiRequest & {
  body: Partial<T>
}

export type ApiRequest = {
  cookies: { token?: string }
  method: string
  params: {
    [key: string]: string
  }
  query: {
    [key: string]: string
  }
}

export const isBrowser = (): boolean => typeof window !== 'undefined'

export const isIpad = (): boolean => {
  return isBrowser() && (
    /iPad/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))
  )
}

import winston, { Logger } from 'winston'

const DOUBLE_DIGITS = 2
const MONTH_OFFSET = 1
const TRIPLE_DIGITS = 3

const formatTime = (time: number, padding: number = DOUBLE_DIGITS): string => {
  return `${time}`.padStart(padding, '0')
}

const format = winston.format.printf((info: winston.Logform.TransformableInfo): string => {
  const now = new Date()
  const month: string = formatTime(now.getMonth() + MONTH_OFFSET)
  const date: string = formatTime(now.getDate())
  const year: number = now.getFullYear()
  const hours: string = formatTime(now.getHours())
  const minutes: string = formatTime(now.getMinutes())
  const seconds: string = formatTime(now.getSeconds())
  const ms: string = formatTime(now.getMilliseconds(), TRIPLE_DIGITS)
  return `${month}-${date}-${year} ${hours}:${minutes}:${seconds}.${ms} [${info.level.toUpperCase()}] ${info.message}`
})

export const logger: Logger = winston.createLogger({
  exitOnError: false,
  format: winston.format.combine(winston.format.splat(), format), // https://nodejs.org/api/util.html#util_util_format_format_args
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console()
  ]
})

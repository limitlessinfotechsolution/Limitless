import winston from 'winston';

const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// For server-side logging with Winston
let winstonLogger: winston.Logger | null = null;

if (!isClient) {
  // Define log levels
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  // Define colors for each level
  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  };

  winston.addColors(colors);

  // Create the Winston logger for server
  winstonLogger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    levels,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'limitlessinfotech' },
    transports: [
      // Write all logs with importance level of `error` or less to `error.log`
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      // Write all logs with importance level of `info` or less to `combined.log`
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

  // If we're not in production then log to the `console` with the format:
  if (isDevelopment) {
    winstonLogger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }));
  }
}

// Logger interface
interface Logger {
  error(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
}

// Client-side logger using console or in test environment
const clientLogger: Logger = {
  error: (message: string, meta?: unknown) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, message, meta);
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[${new Date().toISOString()}] WARN:`, message, meta);
  },
  info: (message: string, meta?: unknown) => {
    console.info(`[${new Date().toISOString()}] INFO:`, message, meta);
  },
  debug: (message: string, meta?: unknown) => {
    if (isDevelopment || process.env.NODE_ENV === 'test') {
      console.debug(`[${new Date().toISOString()}] DEBUG:`, message, meta);
    }
  },
};

// Server-side logger using Winston
const serverLogger: Logger = {
  error: (message: string, meta?: unknown) => winstonLogger?.error(message, meta),
  warn: (message: string, meta?: unknown) => winstonLogger?.warn(message, meta),
  info: (message: string, meta?: unknown) => winstonLogger?.info(message, meta),
  debug: (message: string, meta?: unknown) => winstonLogger?.debug(message, meta),
};

// Export the appropriate logger
export const logger = isClient || process.env.NODE_ENV === 'test' ? clientLogger : serverLogger;

// Global error handler (client-side only)
if (isClient) {
  window.addEventListener('error', (event) => {
    logger.error('Global error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
    });
  });
}

/**
 * Production-ready logging utility
 * 
 * Provides structured logging with levels and remote logging support
 * Essential for debugging issues at scale
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private remoteLogger?: (entry: LogEntry) => void;
  private Sentry?: any;

  constructor() {
    // In production, only log errors and warnings
    this.isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
    
    // Don't load Sentry in constructor - it will be loaded via initSentry() if needed
    this.Sentry = null;
  }

  /**
   * Set remote logger (e.g., Sentry, Firebase Crashlytics)
   */
  setRemoteLogger(logger: (entry: LogEntry) => void) {
    this.remoteLogger = logger;
  }
  
  /**
   * Initialize Sentry integration
   */
  initSentry() {
    try {
      // Import from our Sentry utility (which handles Expo Go check)
      const { getSentry, isSentryAvailable } = require('./sentry');
      if (isSentryAvailable()) {
        this.Sentry = getSentry();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Console logging (development only for debug/info)
    if (this.isDevelopment || level === 'error' || level === 'warn') {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'info' ? console.info : 
                           console.log;
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context || '', error || '');
    }

    // Send to Sentry (if configured)
    if (this.Sentry && (level === 'error' || level === 'warn')) {
      try {
        if (level === 'error' && error) {
          this.Sentry.captureException(error, {
            extra: context,
            tags: { source: 'logger' },
          });
        } else if (level === 'warn') {
          this.Sentry.captureMessage(message, {
            level: 'warning',
            extra: context,
            tags: { source: 'logger' },
          });
        }
      } catch (e) {
        // Don't break app if Sentry fails
        console.error('Failed to send to Sentry:', e);
      }
    }

    // Remote logging (always send errors and warnings)
    if (this.remoteLogger && (level === 'error' || level === 'warn' || this.isDevelopment)) {
      try {
        this.remoteLogger(entry);
      } catch (e) {
        // Don't break app if remote logging fails
        console.error('Failed to send log to remote logger:', e);
      }
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
export default logger;


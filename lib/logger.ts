import * as Sentry from "@sentry/react-native";

/**
 * Logger utility that integrates with Sentry for error tracking and logging
 * Provides a convenient interface for logging at different levels with optional context
 */
export class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log an informational message
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  info(message: string, context?: Record<string, any>): void {
    this.logToConsole("info", message, context);

    // Send as breadcrumb to Sentry for context
    Sentry.addBreadcrumb({
      message,
      level: "info",
      data: context,
      timestamp: Date.now() / 1000,
    });
  }

  /**
   * Log a debug message (only in development)
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  debug(message: string, context?: Record<string, any>): void {
    if (__DEV__) {
      this.logToConsole("debug", message, context);
    }

    // Send as breadcrumb to Sentry for context (even in production for debugging)
    Sentry.addBreadcrumb({
      message,
      level: "debug",
      data: context,
      timestamp: Date.now() / 1000,
    });
  }

  /**
   * Log a warning message
   * @param message - The message to log
   * @param context - Optional context object with additional data
   */
  warn(message: string, context?: Record<string, any>): void {
    this.logToConsole("warn", message, context);

    // Send warning as a message to Sentry
    Sentry.captureMessage(message, "warning");

    // Add context if provided
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext("warning_context", context);
        Sentry.captureMessage(message, "warning");
      });
    }
  }

  /**
   * Log an error message
   * @param message - The error message to log
   * @param error - Optional Error object
   * @param context - Optional context object with additional data
   */
  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, any>
  ): void {
    this.logToConsole("error", message, context, error);

    if (error instanceof Error) {
      // Capture the actual error with Sentry
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext("error_context", context);
        }
        scope.setTag("error_type", "logged_error");
        scope.setLevel("error");
        Sentry.captureException(error);
      });
    } else {
      // Capture as message if no Error object provided
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext("error_context", context);
        }
        if (error) {
          scope.setExtra("error_data", error);
        }
        scope.setTag("error_type", "logged_message");
        scope.setLevel("error");
        Sentry.captureMessage(message, "error");
      });
    }
  }

  /**
   * Log a fatal error (highest severity)
   * @param message - The fatal error message
   * @param error - Optional Error object
   * @param context - Optional context object with additional data
   */
  fatal(
    message: string,
    error?: Error | unknown,
    context?: Record<string, any>
  ): void {
    this.logToConsole("error", `FATAL: ${message}`, context, error);

    if (error instanceof Error) {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext("fatal_context", context);
        }
        scope.setTag("error_type", "fatal_error");
        scope.setLevel("fatal");
        Sentry.captureException(error);
      });
    } else {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext("fatal_context", context);
        }
        if (error) {
          scope.setExtra("error_data", error);
        }
        scope.setTag("error_type", "fatal_message");
        scope.setLevel("fatal");
        Sentry.captureMessage(`FATAL: ${message}`, "fatal");
      });
    }
  }

  /**
   * Set user context for all subsequent logs
   * @param user - User information
   */
  setUser(user: {
    id?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  }): void {
    Sentry.setUser(user);
  }

  /**
   * Set a tag for all subsequent logs
   * @param key - Tag key
   * @param value - Tag value
   */
  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  /**
   * Set context for all subsequent logs
   * @param key - Context key
   * @param context - Context object
   */
  setContext(key: string, context: Record<string, any>): void {
    Sentry.setContext(key, context);
  }

  /**
   * Add a breadcrumb manually
   * @param message - Breadcrumb message
   * @param category - Optional category
   * @param level - Optional level
   * @param data - Optional data
   */
  addBreadcrumb(
    message: string,
    category?: string,
    level?: "debug" | "info" | "warning" | "error" | "fatal",
    data?: Record<string, any>
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level: level || "info",
      data,
      timestamp: Date.now() / 1000,
    });
  }

  /**
   * Capture an exception directly
   * @param error - The error to capture
   * @param context - Optional context
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext("exception_context", context);
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  }

  /**
   * Capture a message directly
   * @param message - The message to capture
   * @param level - The level of the message
   * @param context - Optional context
   */
  captureMessage(
    message: string,
    level: "debug" | "info" | "warning" | "error" | "fatal" = "info",
    context?: Record<string, any>
  ): void {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext("message_context", context);
        Sentry.captureMessage(message, level);
      });
    } else {
      Sentry.captureMessage(message, level);
    }
  }

  /**
   * Log to console with consistent formatting
   */
  private logToConsole(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    context?: Record<string, any>,
    error?: Error | unknown
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        console.debug(prefix, message, context || "", error || "");
        break;
      case "info":
        console.info(prefix, message, context || "");
        break;
      case "warn":
        console.warn(prefix, message, context || "");
        break;
      case "error":
        console.error(prefix, message, context || "", error || "");
        break;
    }
  }
}

// Export a singleton instance for easy use
export const logger = Logger.getInstance();

// Export individual methods for direct import
export const {
  info,
  debug,
  warn,
  error,
  fatal,
  setUser,
  setTag,
  setContext,
  addBreadcrumb,
  captureException,
  captureMessage,
} = logger;

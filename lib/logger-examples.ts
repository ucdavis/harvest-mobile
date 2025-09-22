/**
 * Example usage of the logger utility
 * This file demonstrates how to use the logger in different scenarios
 */

import { debug, error, info, logger, warn } from "./logger";

// Example 1: Basic logging
export function basicLoggingExample() {
  // Using the singleton instance (preferred)
  logger.info("User logged in successfully");
  logger.warn("API response took longer than expected", { responseTime: 5000 });
  logger.error(
    "Failed to save expense",
    new Error("Database connection failed")
  );

  // Using direct imports
  info("This is an info message");
  warn("This is a warning");
  error("This is an error message", new Error("Something went wrong"));
}

// Example 2: Logging with context
export function contextLoggingExample() {
  const userId = "12345";
  const projectId = "67890";

  logger.info("Expense created", {
    userId,
    projectId,
    amount: 25.5,
    description: "Coffee meeting with client",
    timestamp: new Date().toISOString(),
  });

  logger.error("Sync failed", new Error("Network timeout"), {
    userId,
    projectId,
    attemptNumber: 3,
    queueSize: 5,
  });
}

// Example 3: Setting user context and tags
export function userContextExample() {
  // Set user information (will be included in all subsequent logs)
  logger.setUser({
    id: "12345",
    email: "user@example.com",
    username: "john_doe",
  });

  // Set tags for categorization
  logger.setTag("app_version", "1.0.2");
  logger.setTag("user_type", "premium");

  // Set additional context
  logger.setContext("device_info", {
    platform: "ios",
    version: "17.0",
    model: "iPhone 14 Pro",
  });

  // Now all logs will include this context
  logger.info("User performed action");
}

// Example 4: Error handling in try-catch blocks
export async function errorHandlingExample() {
  try {
    // Simulate an API call that might fail
    await simulateApiCall();
    logger.info("API call successful");
  } catch (error) {
    // Log the error with context
    logger.error("API call failed", error, {
      endpoint: "/api/expenses",
      method: "POST",
      retryCount: 0,
    });

    // You could also re-throw if needed
    throw error;
  }
}

// Example 5: Adding breadcrumbs for debugging
export function breadcrumbExample() {
  logger.addBreadcrumb("User opened expenses screen", "navigation");
  logger.addBreadcrumb("User tapped add expense button", "ui.click");
  logger.addBreadcrumb("Expense form validation started", "validation");

  // If an error occurs later, these breadcrumbs will provide context
  logger.error("Form submission failed", new Error("Validation error"));
}

// Example 6: Debug logging (only in development)
export function debugLoggingExample() {
  debug("Debug info that only shows in development", {
    state: { expenses: [], projects: [] },
    performance: { renderTime: 120 },
  });
}

// Example 7: Fatal errors for critical issues
export function fatalErrorExample() {
  try {
    // Critical operation
    initializeDatabase();
  } catch (error) {
    // Use fatal for errors that might crash the app
    logger.fatal("Database initialization failed", error, {
      databasePath: "/data/harvest.db",
      availableSpace: "50MB",
    });
  }
}

// Mock functions for examples
async function simulateApiCall(): Promise<void> {
  if (Math.random() > 0.7) {
    throw new Error("Network timeout");
  }
}

function initializeDatabase(): void {
  if (Math.random() > 0.9) {
    throw new Error("Database corruption detected");
  }
}

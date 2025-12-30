// Error handling utilities

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage || error.message;
  }

  if (error instanceof Error) {
    // Firebase errors
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    if (error.message.includes('permission')) {
      return 'Permission denied. Please check your settings.';
    }
    if (error.message.includes('not-found')) {
      return 'Resource not found.';
    }
    if (error.message.includes('unauthenticated')) {
      return 'Please sign in to continue.';
    }

    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function logError(error: unknown, context?: string) {
  if (__DEV__) {
    console.error(`[${context || 'Error'}]`, error);
  }
  // In production, you might want to send to error tracking service
}


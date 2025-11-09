import { NextResponse } from 'next/server';
import { logger } from './logger';

export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(message: string, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export function createErrorResponse(
  error: Error | ApiError | unknown,
  status = 500,
  logError = true
): NextResponse {
  let message = 'An unexpected error occurred';
  let code = 'INTERNAL_ERROR';
  let details: unknown = undefined;

  if (error instanceof ApiError) {
    message = error.message;
    code = error.code;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  if (logError) {
    logger.error('API Error', {
      message,
      code,
      status,
      details,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  return NextResponse.json(
    {
      error: {
        message,
        code,
        ...(process.env.NODE_ENV === 'development' && details && { details }),
      },
    },
    { status }
  );
}

export function createSuccessResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

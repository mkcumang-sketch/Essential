import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

// 🛡️ ENTERPRISE ERROR HANDLING UTILITIES 🛡️

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHZ_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DB_ERROR');
  }
}

// 🛡️ CENTRALIZED ERROR HANDLER
export const handleError = (error: unknown): NextResponse<ApiResponse> => {
  console.error('🚨 Error Handler:', error);

  // Handle our custom errors
  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: error.statusCode });
  }

  // Handle Mongoose validation errors
  if (error && typeof error === 'object' && 'name' in error) {
    const mongooseError = error as any;
    
    if (mongooseError.name === 'ValidationError') {
      const validationErrors = Object.values(mongooseError.errors).map((err: any) => err.message);
      return NextResponse.json({
        success: false,
        error: validationErrors.join(', '),
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    if (mongooseError.name === 'CastError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format',
        code: 'CAST_ERROR'
      }, { status: 400 });
    }
  }

  // Handle MongoDB duplicate key errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as any;
    
    if (dbError.code === 11000) {
      const field = Object.keys(dbError.keyPattern)[0];
      return NextResponse.json({
        success: false,
        error: `${field} already exists`,
        code: 'DUPLICATE_ERROR'
      }, { status: 409 });
    }
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any;
    const validationErrors = zodError.issues.map((issue: any) => 
      `${issue.path.join('.')}: ${issue.message}`
    );
    return NextResponse.json({
      success: false,
      error: validationErrors.join(', '),
      code: 'VALIDATION_ERROR'
    }, { status: 400 });
  }

  // Handle JWT errors
  if (error && typeof error === 'object' && 'name' in error) {
    const jwtError = error as any;
    
    if (jwtError.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid authentication token',
        code: 'JWT_ERROR'
      }, { status: 401 });
    }

    if (jwtError.name === 'TokenExpiredError') {
      return NextResponse.json({
        success: false,
        error: 'Authentication token expired',
        code: 'JWT_EXPIRED'
      }, { status: 401 });
    }
  }

  // Generic server error
  return NextResponse.json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : (error as Error)?.message || 'Unknown error occurred',
    code: 'INTERNAL_ERROR'
  }, { status: 500 });
};

// 🛡️ ASYNC ERROR WRAPPER
export const asyncHandler = (fn: Function) => {
  return (req: Request, ...args: any[]) => {
    return Promise.resolve(fn(req, ...args)).catch(handleError);
  };
};

// 🛡️ SUCCESS RESPONSE HELPER
export const successResponse = <T = any>(
  data?: T, 
  message?: string, 
  statusCode: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json({
    success: true,
    data,
    message
  }, { status: statusCode });
};

// 🛡️ ERROR RESPONSE HELPER
export const errorResponse = (
  message: string, 
  statusCode: number = 400,
  code?: string
): NextResponse<ApiResponse> => {
  return NextResponse.json({
    success: false,
    error: message,
    code
  }, { status: statusCode });
};

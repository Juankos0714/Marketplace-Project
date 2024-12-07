import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

// Diagnostic logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capture original request details
  const requestDetails = {
    method: req.method,
    path: req.path,
    body: { ...req.body, password: req.body?.password ? '****' : undefined },
    headers: {
      contentType: req.get('Content-Type'),
      userAgent: req.get('User-Agent')
    },
    timestamp: new Date().toISOString()
  };

  // Capture response
  const originalJson = res.json;
  res.json = function(body: any) {
    // Attach timing and request info
    const duration = Date.now() - startTime;
    console.log(JSON.stringify({
      type: 'REQUEST_DIAGNOSTIC',
      requestDetails,
      responseDuration: duration,
      responseStatus: res.statusCode
    }, null, 2));

    // Call original json method
    return originalJson.call(this, body);
  };

  next();
};

export const signIn = async (req: Request, res: Response) => {
  try {
    // Extensive logging of request context
    console.log('Sign-In Request Context:', {
      body: { 
        email: req.body.email, 
        passwordProvided: !!req.body.password 
      },
      headers: {
        contentType: req.get('Content-Type'),
        userAgent: req.get('User-Agent')
      }
    });

    // Rigorous input validation
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      console.warn('Invalid email input:', email);
      return res.status(400).json({ 
        message: "Invalid email",
        details: { 
          email: email,
          type: typeof email,
          isProvided: !!email 
        }
      });
    }

    if (!password || typeof password !== 'string') {
      console.warn('Invalid password input:', !!password);
      return res.status(400).json({ 
        message: "Invalid password",
        details: { 
          passwordProvided: !!password,
          type: typeof password 
        }
      });
    }

    // Comprehensive database query with extended error handling
    const user = await prisma.user.findUnique({
      where: { email }, 
      include: { Access: true },
    }).catch((dbError) => {
      console.error('CRITICAL: Database Query Error', {
        error: dbError,
        errorName: dbError.name,
        errorMessage: dbError.message,
        stack: dbError.stack
      });
      
      // Differentiate database-specific errors
      if (dbError.code === 'P2002') {
        throw new Error('DATABASE_UNIQUE_CONSTRAINT_VIOLATION');
      }
      
      throw new Error('DATABASE_QUERY_FAILED');
    });

    // Detailed user not found logging
    if (!user) {
      console.warn('User Not Found Attempt:', {
        email,
        timestamp: new Date().toISOString()
      });
      return res.status(404).json({ 
        message: "User not found",
        details: { email: email }
      });
    }

    // Password comparison with detailed error tracking
    const validPassword = await compare(password, user.password)
      .catch((compareError) => {
        console.error('Password Comparison Error:', {
          error: compareError,
          userEmail: email
        });
        throw new Error('PASSWORD_COMPARISON_FAILED');
      });

    if (!validPassword) {
      console.warn('Invalid Password Attempt:', {
        email,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    // Token generation with extensive logging
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.Access?.name,
      },
      process.env.JWT_SECRET || '',
      { 
        expiresIn: '24h',
        algorithm: 'HS256'
      }
    );

    console.log('Successful Login:', {
      userId: user.id,
      email: user.email,
      role: user.Access?.name,
      timestamp: new Date().toISOString()
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Access?.name,
      }
    });

  } catch (error) {
    // Comprehensive error logging
    console.error('CRITICAL Sign-In Error', {
      errorName: (error as Error).name,
      errorMessage: (error as Error).message,
      errorStack: (error as Error).stack,
      requestBody: { 
        email: req.body.email, 
        passwordProvided: !!req.body.password 
      }
    });

    return res.status(500).json({ 
      message: "Internal server error",
      details: process.env.NODE_ENV === 'development' 
        ? { 
            errorMessage: (error as Error).message,
            errorName: (error as Error).name, 
          } 
        : undefined
    });
  }
};
import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const signIn = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email, password } = req.body;

    // Comprehensive input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        details: {
          email: email ? "Provided" : "Missing",
          password: password ? "Provided" : "Missing"
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Log authentication attempt (without sensitive info)
    console.log(`Login attempt for email: ${email.replace(/(..)(.*)(@.*)/, "$1****$3")}`);

    // Find user with comprehensive error handling
    const user = await prisma.user.findUnique({
      where: { email }, 
      include: { Access: true },
    }).catch((dbError) => {
      console.error('Database query error:', dbError);
      throw new Error('Database connection failed');
    });

    // User not found
    if (!user) {
      console.warn(`Login attempt for non-existent email: ${email}`);
      return res.status(404).json({ 
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    // Password validation
    const validPassword = await compare(password, user.password).catch((compareError) => {
      console.error('Password comparison error:', compareError);
      throw new Error('Password validation failed');
    });

    // Incorrect password
    if (!validPassword) {
      console.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ 
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS"
      });
    }

    // Ensure JWT secret is defined
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT Secret is not defined');
    }

    // Generate JWT token with additional security
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.Access?.name,
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'marketplace-app',
        algorithm: 'HS256'
      }
    );

    // Successful login response
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.Access?.name,
      },
      metadata: {
        loginTimestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    // Centralized error handling
    console.error('Sign-in process error:', error);

    // Differentiate between types of errors
    if (error instanceof Error) {
      switch (error.message) {
        case 'Database connection failed':
          return res.status(503).json({ 
            message: "Service unavailable",
            code: "DATABASE_ERROR"
          });
        case 'JWT Secret is not defined':
          return res.status(500).json({ 
            message: "Server configuration error",
            code: "CONFIG_ERROR"
          });
        default:
          return res.status(500).json({ 
            message: "Internal server error",
            code: "INTERNAL_ERROR",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
      }
    }

    // Fallback for unexpected errors
    return res.status(500).json({ 
      message: "Unexpected error occurred",
      code: "UNEXPECTED_ERROR"
    });
  }
};
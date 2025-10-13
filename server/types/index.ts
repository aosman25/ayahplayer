import { Request } from "express";

// Extend Express Request to include accessToken
export interface AuthRequest extends Request {
  accessToken?: string;
}

// Environment variables type
export interface EnvConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  AUTH_URL: string;
  BASE_URL: string;
  PORT?: string;
}

// Token response type
export interface TokenResponse {
  access_token: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
}

// Request body for authenticated endpoints
export interface AuthRequestBody {
  access_token: string;
  language?: string;
}

// Re-export all response types for convenience
export * from "./responses";

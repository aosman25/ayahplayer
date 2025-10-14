import { Response, NextFunction } from "express";
import { AuthRequest, ErrorResponse } from "../types";

// Middleware to check for access token in Authorization header
export const requireAccessToken = (
  req: AuthRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): void | Response<ErrorResponse> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is required" });
  }

  // Check if it starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header must start with 'Bearer '" });
  }

  // Extract token after "Bearer "
  const accessToken = authHeader.substring(7);

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is required" });
  }

  req.accessToken = accessToken;
  next();
};

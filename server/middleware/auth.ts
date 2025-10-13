import { Response, NextFunction } from "express";
import { AuthRequest, ErrorResponse } from "../types";

// Middleware to check for access token
export const requireAccessToken = (
  req: AuthRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): void | Response<ErrorResponse> => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }

  const { access_token: accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({ error: "Access Token is required" });
  }

  req.accessToken = accessToken;
  next();
};

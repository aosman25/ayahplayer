import { Response } from "express";
import axios from "axios";
import { AuthRequest, ErrorResponse } from "../types";

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get all chapters
// @route   POST /api/chapters
// @access  Private (requires access token)
export const getAllChapters = async (
  req: AuthRequest,
  res: Response<any | ErrorResponse>
): Promise<void> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/content/api/v4/chapters`,
      headers: {
        Accept: "application/json",
        "x-auth-token": req.accessToken,
        "x-client-id": CLIENT_ID,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    const statusCode = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;
    const errorMessage = axios.isAxiosError(error)
      ? error.message
      : (error as Error).message;
    res.status(statusCode).json({ error: errorMessage });
  }
};

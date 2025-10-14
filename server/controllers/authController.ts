import { Request, Response } from "express";
import axios from "axios";
import { TokenResponse, ErrorResponse } from "../types";

const { CLIENT_ID, CLIENT_SECRET, AUTH_URL } = process.env;

// @desc    Get access token
// @route   GET /api/token
// @access  Public
export const getToken = async (
  _req: Request,
  res: Response<TokenResponse | ErrorResponse>
): Promise<void> => {
  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const response = await axios<TokenResponse>({
      method: "post",
      url: `${AUTH_URL}/oauth2/token`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials&scope=content",
    });

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(
      "Token request failed:",
      axios.isAxiosError(error) ? error.response?.data : (error as Error).message
    );
    res.status(500).json({ error: "Failed to get access token" });
  }
};

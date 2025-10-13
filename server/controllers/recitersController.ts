import { Response } from "express";
import axios from "axios";
import { AuthRequest, ErrorResponse } from "../types";
import { RecitersResponse, AudioFilesResponse } from "../types/responses";

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get all reciters
// @route   POST /api/reciters
// @access  Private (requires access token)
export const getAllReciters = async (
  req: AuthRequest,
  res: Response<RecitersResponse | ErrorResponse>
): Promise<void> => {
  try {
    const { language = "en" } = req.body;
    const response = await axios<RecitersResponse>({
      method: "get",
      url: `${BASE_URL}/content/api/v4/resources/recitations`,
      headers: {
        Accept: "application/json",
        "x-auth-token": req.accessToken,
        "x-client-id": CLIENT_ID,
      },
      params: {
        language,
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

// @desc    Get verses by rub and recitation
// @route   POST /api/rub/:rub_number/recitation/:recitation_id
// @access  Private (requires access token)
export const getVersesByRubAndRecitation = async (
  req: AuthRequest,
  res: Response<AudioFilesResponse | ErrorResponse>
): Promise<void | Response<ErrorResponse>> => {
  try {
    const rubNumber = Number(req.params.rub_number);
    const recitationId = Number(req.params.recitation_id);

    if (isNaN(rubNumber) || isNaN(recitationId)) {
      return res
        .status(400)
        .json({ error: "Rub Number and Recitation ID must be numbers" });
    } else if (rubNumber < 1 || rubNumber > 240) {
      return res.status(400).json({ error: "Rub Number must be between 1 and 240" });
    }

    const response = await axios<AudioFilesResponse>({
      method: "get",
      url: `${BASE_URL}/content/api/v4/recitations/${recitationId}/by_rub/${rubNumber}`,
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

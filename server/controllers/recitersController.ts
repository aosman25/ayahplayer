import { Response } from "express";
import axios from "axios";
import { AuthRequest, ErrorResponse } from "../types";
import { RecitersResponse, AudioFilesResponse } from "../types/responses";

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get all reciters
// @route   GET /api/reciters
// @access  Private (requires access token)
export const getAllReciters = async (
  req: AuthRequest,
  res: Response<RecitersResponse | ErrorResponse>
): Promise<void> => {
  try {
    const { language = "en" } = req.query;
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

// @desc    Get audio files for ayahs by rub and recitation
// @route   GET /api/reciters/rub/:rub_number/recitation/:recitation_id
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

// @desc    Get audio files by juz and recitation
// @route   GET /api/reciters/recitations/:recitation_id/by_juz/:juz_number
// @access  Private (requires access token)
export const getVersesByJuzAndRecitation = async (
  req: AuthRequest,
  res: Response<AudioFilesResponse | ErrorResponse>
): Promise<void | Response<ErrorResponse>> => {
  try {
    const juzNumber = Number(req.params.juz_number);
    const recitationId = Number(req.params.recitation_id);

    if (isNaN(juzNumber) || isNaN(recitationId)) {
      return res
        .status(400)
        .json({ error: "Juz Number and Recitation ID must be numbers" });
    } else if (juzNumber < 1 || juzNumber > 30) {
      return res.status(400).json({ error: "Juz Number must be between 1 and 30" });
    }

    const response = await axios<AudioFilesResponse>({
      method: "get",
      url: `${BASE_URL}/content/api/v4/recitations/${recitationId}/by_juz/${juzNumber}`,
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

// @desc    Get audio files by hizb and recitation
// @route   GET /api/reciters/recitations/:recitation_id/by_hizb/:hizb_number
// @access  Private (requires access token)
export const getVersesByHizbAndRecitation = async (
  req: AuthRequest,
  res: Response<AudioFilesResponse | ErrorResponse>
): Promise<void | Response<ErrorResponse>> => {
  try {
    const hizbNumber = Number(req.params.hizb_number);
    const recitationId = Number(req.params.recitation_id);

    if (isNaN(hizbNumber) || isNaN(recitationId)) {
      return res
        .status(400)
        .json({ error: "Hizb Number and Recitation ID must be numbers" });
    } else if (hizbNumber < 1 || hizbNumber > 60) {
      return res.status(400).json({ error: "Hizb Number must be between 1 and 60" });
    }

    const response = await axios<AudioFilesResponse>({
      method: "get",
      url: `${BASE_URL}/content/api/v4/recitations/${recitationId}/by_hizb/${hizbNumber}`,
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

import { Response } from "express";
import axios from "axios";
import { AuthRequest, ErrorResponse } from "../types";
import { VersesResponse } from "../types/responses";

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get Uthmani script of verses with optional filters
// @route   GET /api/verses/uthmani
// @access  Private (requires access token)
export const getUthmaniVerses = async (
  req: AuthRequest,
  res: Response<VersesResponse | ErrorResponse>
): Promise<void | Response<ErrorResponse>> => {
  try {
    const {
      chapter_number,
      juz_number,
      page_number,
      hizb_number,
      rub_el_hizb_number,
      verse_key
    } = req.query;

    // Validate query parameters if provided
    if (chapter_number && (Number(chapter_number) < 1 || Number(chapter_number) > 114)) {
      return res.status(400).json({ error: "chapter_number must be between 1 and 114" });
    }
    if (juz_number && (Number(juz_number) < 1 || Number(juz_number) > 30)) {
      return res.status(400).json({ error: "juz_number must be between 1 and 30" });
    }
    if (page_number && (Number(page_number) < 1 || Number(page_number) > 604)) {
      return res.status(400).json({ error: "page_number must be between 1 and 604" });
    }
    if (hizb_number && (Number(hizb_number) < 1 || Number(hizb_number) > 60)) {
      return res.status(400).json({ error: "hizb_number must be between 1 and 60" });
    }
    if (rub_el_hizb_number && (Number(rub_el_hizb_number) < 1 || Number(rub_el_hizb_number) > 240)) {
      return res.status(400).json({ error: "rub_el_hizb_number must be between 1 and 240" });
    }

    // Build query parameters
    const params: Record<string, string> = {};
    if (chapter_number) params.chapter_number = String(chapter_number);
    if (juz_number) params.juz_number = String(juz_number);
    if (page_number) params.page_number = String(page_number);
    if (hizb_number) params.hizb_number = String(hizb_number);
    if (rub_el_hizb_number) params.rub_el_hizb_number = String(rub_el_hizb_number);
    if (verse_key) params.verse_key = String(verse_key);

    const response = await axios<VersesResponse>({
      method: "get",
      url: `${BASE_URL}/content/api/v4/quran/verses/uthmani`,
      headers: {
        Accept: "application/json",
        "x-auth-token": req.accessToken,
        "x-client-id": CLIENT_ID,
      },
      params,
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

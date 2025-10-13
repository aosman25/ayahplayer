const axios = require("axios");

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get all reciters
// @route   POST /api/reciters
// @access  Private (requires access token)
const getAllReciters = async (req, res) => {
  try {
    const { language = "en" } = req.body;
    const response = await axios({
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
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

// @desc    Get verses by rub and recitation
// @route   POST /api/rub/:rub_number/recitation/:recitation_id
// @access  Private (requires access token)
const getVersesByRubAndRecitation = async (req, res) => {
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

    const response = await axios({
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
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

module.exports = { getAllReciters, getVersesByRubAndRecitation };

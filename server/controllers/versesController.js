const axios = require("axios");

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get verses by rub number
// @route   POST /api/verses/rub/:rub_number
// @access  Private (requires access token)
const getVersesByRub = async (req, res) => {
  try {
    const rubNumber = Number(req.params.rub_number);

    if (isNaN(rubNumber)) {
      return res.status(400).json({ error: "Rub Number must be a valid number" });
    } else if (rubNumber < 1 || rubNumber > 240) {
      return res.status(400).json({ error: "Rub Number must be between 1 and 240" });
    }

    const response = await axios({
      method: "get",
      url: `${BASE_URL}/content/api/v4/verses/by_rub/${rubNumber}`,
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

module.exports = { getVersesByRub };

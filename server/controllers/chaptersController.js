const axios = require("axios");

const { CLIENT_ID, BASE_URL } = process.env;

// @desc    Get all chapters
// @route   POST /api/chapters
// @access  Private (requires access token)
const getAllChapters = async (req, res) => {
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
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

module.exports = { getAllChapters };

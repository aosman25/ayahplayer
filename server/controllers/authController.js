const axios = require("axios");

const { CLIENT_ID, CLIENT_SECRET, AUTH_URL } = process.env;

// @desc    Get access token
// @route   POST /api/token
// @access  Public
const getToken = async (req, res) => {
  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const response = await axios({
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
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get access token" });
  }
};

module.exports = { getToken };

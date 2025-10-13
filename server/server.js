const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { CLIENT_ID, CLIENT_SECRET, AUTH_URL, BASE_URL } = process.env;

app.post("/api/token", async (req, res) => {
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
});

app.post("/api/chapters", async (req, res) => {
  try {
    const { access_token: accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access Token is required" });
    }
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/content/api/v4/chapters`,
      headers: {
        Accept: "application/json",
        "x-auth-token": accessToken,
        "x-client-id": CLIENT_ID,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing the request" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

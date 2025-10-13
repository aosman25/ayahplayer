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
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post("/api/reciters", async (req, res) => {
  try {
    const { access_token: accessToken, language = "en" } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access Token is required" });
    }
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/content/api/v4/resources/recitations`,
      headers: {
        Accept: "application/json",
        "x-auth-token": accessToken,
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
});

app.post("/api/rub/:rub_number/recitation/:recitation_id", async (req, res) => {
  try {
    const { access_token: accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access Token is required" });
    }
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
        "x-auth-token": accessToken,
        "x-client-id": CLIENT_ID,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post("/api/verses/rub/:rub_number", async (req, res) => {
  try {
    const { access_token: accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Access Token is required" });
    }
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
        "x-auth-token": accessToken,
        "x-client-id": CLIENT_ID,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

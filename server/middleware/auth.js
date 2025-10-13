// Middleware to check for access token
const requireAccessToken = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }
  const { access_token: accessToken } = req.body;
  if (!accessToken) {
    return res.status(401).json({ error: "Access Token is required" });
  }
  req.accessToken = accessToken;
  next();
};

module.exports = { requireAccessToken };

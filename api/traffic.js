const https = require("https");

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.ITS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        result: "error",
        error: "ITS_API_KEY is not configured"
      });
    }

    const url =
      "http://api.jejuits.go.kr/api/getFrafficInfo" +
      "?code=" + encodeURIComponent(apiKey) +
      "&type=L";

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store"
    });

    const body = await response.text();

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    res.setHeader("Content-Type", "application/json");

    return res.status(response.status).send(body);
  } catch (error) {
    return res.status(502).json({
      result: "error",
      error: String(error)
    });
  }
};

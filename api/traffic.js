const http = require("http");

module.exports = async (req, res) => {
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

  const request = http.get(url, (response) => {
    let body = "";

    response.setEncoding("utf8");

    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on("end", () => {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, max-age=0"
      );
      res.setHeader("Content-Type", "application/json");

      return res.status(response.statusCode || 502).send(body);
    });
  });

  request.setTimeout(15000, () => {
    request.destroy(new Error("ITS HTTP request timeout"));
  });

  request.on("error", (error) => {
    return res.status(502).json({
      result: "error",
      error: String(error),
      code: error.code || null,
      cause: error.cause ? String(error.cause) : null
    });
  });
};

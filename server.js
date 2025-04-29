const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Missing URL parameter");
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get("content-type");
    res.set("Content-Type", contentType);
    const body = await response.text();
    res.send(body);
  } catch (error) {
    res.status(500).send("Error fetching target URL");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

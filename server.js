const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder (optional, adjust if needed)
app.use(express.static(path.join(__dirname, "public")));

// General request handler (can act as a web fetcher)
app.get("/go", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing URL");

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

// Catch-all to route everything else to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder (optional, adjust if needed)
app.use(express.static(path.join(__dirname, "public")));

// General request handler (can act as a web fetcher)
const cheerio = require('cheerio');

app.get('/go', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    // Load HTML into Cheerio to modify it
    const $ = cheerio.load(html);

    // Rewrite relative URLs
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http')) {
        $(el).attr('src', `/go?url=${encodeURIComponent(new URL(src, targetUrl))}`);
      }
    });

    $('link').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('http')) {
        $(el).attr('href', `/go?url=${encodeURIComponent(new URL(href, targetUrl))}`);
      }
    });

    $('script').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http')) {
        $(el).attr('src', `/go?url=${encodeURIComponent(new URL(src, targetUrl))}`);
      }
    });

    res.send($.html());
  } catch (err) {
    res.status(500).send('Error fetching or rewriting target content');
  }
});


// Catch-all to route everything else to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

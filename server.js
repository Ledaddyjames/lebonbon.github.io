const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('public'));

app.get('/go', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    const $ = cheerio.load(html);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

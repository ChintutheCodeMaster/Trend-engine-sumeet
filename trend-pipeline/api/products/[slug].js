// api/products/[slug].js
// Dynamic route — serves the generated landing page HTML for a given product slug.
// Example: GET /products/best-ai-productivity-tools-2025

require('dotenv').config();
const store = require('../../lib/store');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug parameter' });
  }

  try {
    const html = await store.get(`product:${slug}:landing`);

    if (!html) {
      return res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Product Not Found</title>
  <style>
    body { background: #0d0d0d; color: #f0f0f0; font-family: sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; flex-direction: column; gap: 16px; }
    h1 { font-size: 1.8rem; }
    p { color: #888; }
    a { color: #6c63ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Product not found</h1>
  <p>No landing page exists for <strong>${slug}</strong>.</p>
  <p>The pipeline may not have run yet, or this slug is incorrect.</p>
  <a href="/api">← View all available products</a>
</body>
</html>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

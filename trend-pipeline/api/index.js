// api/index.js
// Lists all generated products stored in the KV / in-memory store.
// GET /api → returns JSON array of products with their landing page URLs.

require('dotenv').config();
const store = require('../lib/store');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slugs = await store.smembers('products:slugs');

    const products = await Promise.all(
      slugs.map(async (slug) => {
        const metaRaw = await store.get(`product:${slug}:meta`);
        if (!metaRaw) return null;
        try {
          const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
          return {
            ...meta,
            landingUrl: `/products/${slug}`
          };
        } catch {
          return { slug, landingUrl: `/products/${slug}` };
        }
      })
    );

    const valid = products
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({
      total: valid.length,
      products: valid
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

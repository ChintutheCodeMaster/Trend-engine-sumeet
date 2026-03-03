// lib/store.js
// Storage abstraction: Upstash Redis in production, in-memory Map for local dev.
//
// Upstash Redis setup (required for persistence on Vercel):
//   1. Go to https://console.upstash.com → Create a Redis database
//   2. Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN into your Vercel env vars
//   3. No other config needed.
//
// Without those env vars, the store falls back to an in-memory Map (data lost on restart).

let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const { Redis } = require('@upstash/redis');
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
    console.log('[store] Using Upstash Redis for persistent storage.');
  } catch (e) {
    console.warn('[store] @upstash/redis package not found. Falling back to in-memory store. Run: npm install @upstash/redis');
  }
} else {
  console.log('[store] Upstash env vars not set. Using in-memory store (data will not persist across restarts).');
}

const mem = new Map();

/**
 * Store a value by key. Strings are stored as-is; objects are JSON-serialized.
 */
async function set(key, value) {
  const data = typeof value === 'string' ? value : JSON.stringify(value);
  if (redis) {
    await redis.set(key, data);
  } else {
    mem.set(key, data);
  }
}

/**
 * Retrieve a value by key. Returns null if not found.
 */
async function get(key) {
  if (redis) {
    return await redis.get(key);
  }
  return mem.get(key) ?? null;
}

/**
 * Add one or more members to a set stored at key.
 */
async function sadd(key, ...members) {
  if (redis) {
    return await redis.sadd(key, ...members);
  }
  const existing = mem.get(key) || [];
  let added = 0;
  for (const m of members) {
    if (!existing.includes(m)) {
      existing.push(m);
      added++;
    }
  }
  mem.set(key, existing);
  return added;
}

/**
 * Return all members of a set stored at key.
 */
async function smembers(key) {
  if (redis) {
    return await redis.smembers(key);
  }
  return mem.get(key) || [];
}

module.exports = { set, get, sadd, smembers };

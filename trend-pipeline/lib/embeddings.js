require('dotenv').config();
const OpenAI = require('openai');

let _client;
function getClient() {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY env var is not set');
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

async function generateEmbedding(text) {
  const { data } = await getClient().embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),
  });
  return data[0].embedding;
}

module.exports = { generateEmbedding };

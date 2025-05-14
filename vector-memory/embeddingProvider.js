/**
 * embeddingProvider.js
 * 
 * EmbeddingProvider implementation using OpenAI API for text embedding.
 * 
 * Requires: npm install node-fetch
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

function loadOpenAIApiKeyFromConfig() {
  try {
    const configPath = path.resolve(process.cwd(), 'config.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);
    return config.apiKeys && config.apiKeys.openai ? config.apiKeys.openai : null;
  } catch (err) {
    return null;
  }
}

class EmbeddingProvider {
  /**
   * @param {object} config - { openaiApiKey: string }
   */
  constructor(config) {
    this.apiKey = config.openaiApiKey || loadOpenAIApiKeyFromConfig();
    this.model = config.model || "text-embedding-ada-002";
    if (!this.apiKey) {
      throw new Error("OpenAI API key not found. Please set it in config.json under apiKeys.openai or provide it in the config object.");
    }
  }

  /**
   * Generate an embedding for a given text using OpenAI API.
   * @param {string} text 
   * @returns {Promise<Array<number>>}
   */
  async embed(text) {
    const endpoint = "https://api.openai.com/v1/embeddings";
    const body = {
      input: text,
      model: this.model
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI embedding error: ${res.status} ${err}`);
    }
    const data = await res.json();
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error("No embedding returned from OpenAI");
    }
    return data.data[0].embedding;
  }
}

export default EmbeddingProvider;

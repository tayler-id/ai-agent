// LLM analysis module

import fetch from 'node-fetch';

/**
 * Analyzes a YouTube transcript using DeepSeek LLM API.
 * @param {string} transcript - The transcript text.
 * @returns {Promise<object>} - Analysis result (summary, key concepts, steps)
 */
export async function analyzeTranscript(transcript) {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.deepseek_api_key || "sk-1d3f824222a249818c8aa5433d33124a";
  const endpoint = "https://api.deepseek.com/v1/chat/completions";
  const model = "deepseek-chat"; // or "deepseek-coder" if preferred

  const prompt = `
You are an expert technical assistant. Given the following YouTube transcript, analyze it and return a JSON object with:
- summary: a concise summary of the video
- keyConcepts: an array of the main technical or conceptual topics
- steps: an array of step-by-step instructions or main actions described

Transcript:
"""${transcript}"""

Respond ONLY with a valid JSON object in this format:
{
  "summary": "...",
  "keyConcepts": ["...", "..."],
  "steps": ["...", "..."]
}
`;

  const body = {
    model,
    messages: [
      { role: "system", content: "You are a helpful technical assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 512
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response from DeepSeek LLM");

  // Try to parse the JSON from the LLM response
  try {
    // Remove Markdown code block if present
    let jsonText = content.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
    }
    const result = JSON.parse(jsonText);
    if (result.summary && Array.isArray(result.keyConcepts) && Array.isArray(result.steps)) {
      return result;
    }
    throw new Error("Incomplete analysis from LLM");
  } catch (err) {
    throw new Error("Failed to parse LLM response as JSON: " + err.message + "\nRaw LLM output:\n" + content);
  }
}

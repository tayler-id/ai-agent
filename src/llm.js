// LLM analysis module

import fetch from 'node-fetch';

/**
 * Analyzes a YouTube transcript using DeepSeek LLM API.
 * @param {string} transcript - The transcript text.
 * @param {object} llmConfig - Configuration for the LLM call (apiKey, model, maxTokens, temperature).
 * @returns {Promise<object>} - Analysis result (summary, key concepts, steps)
 */
export async function analyzeTranscript(transcript, llmConfig) {
  const { apiKey, model, maxTokens, temperature } = llmConfig;
  if (!apiKey) {
    console.error('API key not provided to analyzeTranscript.');
    throw new Error("API key not configured for transcript analysis.");
  }
  const endpoint = "https://api.deepseek.com/v1/chat/completions";

  const prompt = `
You are an expert technical analyst and educator. Your task is to analyze the provided YouTube video transcript and generate a detailed "Improvement and Re-implementation Blueprint".
This blueprint should enable another AI coding agent to build a significantly improved version of the project/concept explained in the video, or a more robust alternative.

Provided YouTube Transcript:
"""
${transcript}
"""

Respond ONLY with a valid JSON object with the following structure:
{
  "originalProjectSummary": {
    "purpose": "Concise purpose of the project or concept explained in the video.",
    "coreMechanics": ["List key concepts, algorithms, or distinct operational steps demonstrated or explained in the video."]
  },
  "suggestedEnhancedVersion": {
    "concept": "Propose a clear concept for an enhanced or alternative version of what is taught in the video (e.g., 'A web application demonstrating X with added user accounts', 'A more performant version of algorithm Y using Z technique').",
    "keyEnhancements": [
      {
        "enhancementTitle": "Provide a short, descriptive title for this enhancement (e.g., Add interactive UI elements).",
        "description": "Detail what this enhancement involves and how it improves upon what was shown in the video.",
        "reasoning": "Explain why this enhancement is valuable (e.g., 'improves user engagement, provides better visualization, makes it more practical').",
        "actionableStepsForCodingAgent": [
          "Provide 3-5 concrete, actionable steps a coding agent could take to implement this enhancement. Be specific."
        ],
        "relevantOriginalContext": ["Briefly mention parts of the video transcript (e.g., specific timestamps or concepts) that this enhancement builds upon or replaces, if applicable."]
      }
    ],
    "suggestedTechStack": ["List key technologies (languages, frameworks, libraries) for implementing the enhanced version, with a brief rationale if they differ from the original or are new additions based on the video's topic."],
    "criticalFilesToCreateOrModify": ["Identify a few critical new files a coding agent would need to create, or key code structures, for the enhanced version."],
    "suggestedBoilerplate": "Provide a single string containing suggested code snippets, file structures, or scaffolding guidance (e.g., a basic class definition, a file header, a directory structure) that would help a coding agent start implementing the enhancements. Format this as a Markdown code block if applicable.",
    "gapAnalysis": ["List specific gaps in the original project (e.g., missing features, lack of tests, poor documentation) and potential areas for competitive advantage or unique value proposition for the enhanced version."]
  }
}

Ensure all fields are populated. For arrays like 'coreMechanics', 'keyEnhancements', and 'gapAnalysis', provide at least 1-2 items, and for 'actionableStepsForCodingAgent', provide 3-5 steps per enhancement. If specific information isn't clear from the transcript, make reasonable inferences or state 'Not clearly determinable from provided transcript'.
Focus on providing practical, actionable information for a downstream AI coding agent.
`;

  const body = {
    model,
    messages: [
      { role: "system", content: "You are an expert technical analyst and educator." },
      { role: "user", content: prompt }
    ],
    temperature: temperature || 0.3,
    max_tokens: maxTokens || 1024
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
    let jsonString = content;
    // Attempt to extract JSON from a string that might contain it within other text or markdown
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    } else {
      // If no braces, it's not JSON, or malformed beyond simple extraction
      console.error("Could not find JSON object in LLM response for transcript. Raw content:", content);
      throw new Error("No valid JSON object found in LLM response for transcript.");
    }
    
    const result = JSON.parse(jsonString); // Attempt to parse the extracted string

    // Basic validation for the new blueprint structure
    if (result.originalProjectSummary && result.suggestedEnhancedVersion && 
        Array.isArray(result.suggestedEnhancedVersion.keyEnhancements) &&
        result.suggestedEnhancedVersion.keyEnhancements.every(e => e.actionableStepsForCodingAgent)) {
      return result;
    }
    console.error("LLM response for transcript analysis did not match expected blueprint structure:", result);
    throw new Error("Incomplete or malformed blueprint from LLM for transcript content.");
  } catch (err) {
    console.error("Failed to parse LLM response for transcript analysis as JSON. Raw output:\n", content);
    throw new Error("Failed to parse LLM response for transcript analysis as JSON: " + err.message);
  } // This closes the catch (err)
} // This correctly closes analyzeTranscript

export async function getFollowUpAnswer(contextContent, initialAnalysis, userQuestion, llmConfig) {
  const { apiKey, model, maxTokens, temperature } = llmConfig;
  if (!apiKey) {
    console.error('API key not provided to getFollowUpAnswer.');
    return "API key not configured. Cannot answer follow-up.";
  }

  // The 'initialAnalysis' is now the full blueprint object.
  // 'contextContent' is the original repo/transcript content.
  const systemMessage = `You are an expert assistant. Your task is to answer the user's question or refine a part of the provided "Initial Improvement & Re-implementation Blueprint".
Base your response *only* on the provided context (original content and the initial blueprint).
If the user asks a question, answer it directly.
If the user asks to refine a section of the blueprint (e.g., "Refine enhancement X by adding Y" or "Make step Z more detailed"), provide the refined text for that part or an updated version of the relevant section.
If the information isn't in the context for a direct question, state that clearly.`;
  
  const userPrompt = `
Original Content Summary (for broader context if needed):
"""
${contextContent.substring(0, 2000)}... 
"""
(Note: Original content might be very long, only a snippet is shown here for brevity in this prompt, but you should assume the full original content was used for the initial blueprint generation if you need to refer to it conceptually.)

Initial Improvement & Re-implementation Blueprint:
\`\`\`json
${JSON.stringify(initialAnalysis, null, 2)}
\`\`\`

User's Request (this could be a question OR a refinement instruction): "${userQuestion}"

Response:`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || "deepseek-chat", 
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ],
        max_tokens: maxTokens || 500, 
        temperature: temperature || 0.2,
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error in getFollowUpAnswer: ${response.status} ${response.statusText}`, errorBody);
      return `Error from LLM API: ${response.statusText}`;
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('No content in LLM response for getFollowUpAnswer:', data);
      return "Could not get a follow-up answer from the LLM.";
    }
  } catch (error) {
    console.error('Error in getFollowUpAnswer LLM call:', error);
    return `Error during follow-up LLM call: ${error.message}`;
  }
}

/**
 * Analyzes GitHub repository content using DeepSeek LLM API.
 * @param {string} repoContentString - Concatenated string of key repository files.
 * @param {object} llmConfig - Configuration for the LLM call (apiKey, model, maxTokens, temperature).
 * @returns {Promise<object>} - Analysis result.
 */
export async function analyzeRepoContent(repoContentString, llmConfig) {
  const { apiKey, model, maxTokens, temperature } = llmConfig;
   if (!apiKey) {
    console.error('API key not provided to analyzeRepoContent.');
    throw new Error("API key not configured for repository analysis.");
  }
  const endpoint = "https://api.deepseek.com/v1/chat/completions";

  const prompt = `
You are an expert software architect and reverse engineer. Your task is to analyze the provided GitHub repository content and generate a detailed "Improvement and Re-implementation Blueprint".
This blueprint should enable another AI coding agent to build a significantly improved version or a more robust alternative.

Provided Repository Content:
"""
${repoContentString}
"""

Respond ONLY with a valid JSON object with the following structure:
{
  "originalProjectSummary": {
    "purpose": "Concise purpose of the original project based on the provided content.",
    "coreMechanics": ["List key algorithms, data flows, or distinct operational steps observed in the original project content."]
  },
  "suggestedEnhancedVersion": {
    "concept": "Propose a clear concept for an enhanced or alternative version (e.g., 'A more modular microservice version of X', 'A version of Y with an added REST API and improved error handling').",
    "keyEnhancements": [
      {
        "enhancementTitle": "Provide a short, descriptive title for this enhancement (e.g., Implement a REST API for core features).",
        "description": "Detail what this enhancement involves and how it improves upon the original.",
        "reasoning": "Explain why this enhancement is valuable (e.g., 'improves scalability, allows external integrations, enhances user experience').",
        "actionableStepsForCodingAgent": [
          "Provide 3-5 concrete, actionable steps a coding agent could take to implement this enhancement. Be specific."
        ],
        "relevantOriginalContext": ["Briefly mention parts of the original content (e.g., specific files or concepts) that this enhancement builds upon or replaces, if applicable."]
      }
    ],
    "suggestedTechStack": ["List key technologies (languages, frameworks, libraries) for implementing the enhanced version, with a brief rationale if they differ significantly from the original or are new additions."],
    "criticalFilesToCreateOrModify": ["Identify a few critical new files a coding agent would need to create, or existing files that would require significant modification for the enhanced version."],
    "suggestedBoilerplate": "Provide a single string containing suggested code snippets, file structures, or scaffolding guidance (e.g., a basic class definition, a file header, a directory structure) that would help a coding agent start implementing the enhancements. Format this as a Markdown code block if applicable.",
    "gapAnalysis": ["List specific gaps in the original project (e.g., missing features, lack of tests, poor documentation) and potential areas for competitive advantage or unique value proposition for the enhanced version."]
  }
}

Ensure all fields are populated. For arrays like 'coreMechanics', 'keyEnhancements', and 'gapAnalysis', provide at least 1-2 items, and for 'actionableStepsForCodingAgent', provide 3-5 steps per enhancement. If specific information isn't clear from the text, make reasonable inferences or state 'Not clearly determinable from provided content'.
Focus on providing practical, actionable information for a downstream AI coding agent.
`;

  const body = {
    model,
    messages: [
      { role: "system", content: "You are an expert software architect and technical analyst." },
      { role: "user", content: prompt }
    ],
    temperature: temperature || 0.3,
    max_tokens: maxTokens || 1024
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
    const errorBody = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response from DeepSeek LLM for repo analysis");

  try {
    let jsonString = content;
    // Attempt to extract JSON from a string that might contain it within other text or markdown
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    } else {
      // If no braces, it's not JSON, or malformed beyond simple extraction
      console.error("Could not find JSON object in LLM response for repository. Raw content:", content);
      throw new Error("No valid JSON object found in LLM response for repository.");
    }

    const result = JSON.parse(jsonString); // Attempt to parse the extracted string

    // Basic validation for the new blueprint structure
    if (result.originalProjectSummary && result.suggestedEnhancedVersion && 
        Array.isArray(result.suggestedEnhancedVersion.keyEnhancements) &&
        result.suggestedEnhancedVersion.keyEnhancements.every(e => e.actionableStepsForCodingAgent)) {
      return result;
    }
    console.error("LLM response for repo analysis did not match expected blueprint structure:", result);
    throw new Error("Incomplete or malformed blueprint from LLM for repo content.");
  } catch (err) {
    console.error("Failed to parse LLM response for repo analysis as JSON. Raw output:\n", content);
    throw new Error("Failed to parse LLM response for repo analysis as JSON: " + err.message);
  }
}

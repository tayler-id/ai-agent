// Prompt generator for coding agent

/**
 * Generates coding prompts from LLM analysis of a YouTube video.
 * @param {object} analysis - The analysis object from the LLM.
 * @returns {Promise<string[]>} - Array of prompts for a coding agent.
 */
export async function generatePrompts(analysis) {
  // TODO: Replace with more advanced prompt engineering as needed.
  // For now, use the steps and key concepts from the analysis.
  const prompts = [];

  if (analysis.summary) {
    prompts.push(`Summarize the main goal of the project: ${analysis.summary}`);
  }
  if (Array.isArray(analysis.keyConcepts)) {
    prompts.push(`List and explain the key concepts: ${analysis.keyConcepts.join(', ')}`);
  }
  if (Array.isArray(analysis.steps)) {
    analysis.steps.forEach((step, i) => {
      prompts.push(`Implement step ${i + 1}: ${step}`);
    });
  }
  prompts.push('After implementing, suggest improvements or extensions to the project.');
  return prompts;
}

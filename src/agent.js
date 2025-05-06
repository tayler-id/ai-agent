import { fileURLToPath } from 'url';

// Conversational AI Agent CLI (ESM)
import readline from 'readline';
import fs from 'fs';
import { fetchTranscript } from './youtube.js';
import { analyzeTranscript } from './llm.js';
import { generatePrompts } from './promptGenerator.js';

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Welcome to the AI Agent!');

  // Helper to ask a question and return a promise
  function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
  }

  while (true) {
    const url = await ask('Enter a YouTube video URL (or type "exit" to quit): ');
    if (url.trim().toLowerCase() === 'exit' || url.trim().toLowerCase() === 'quit') {
      rl.close();
      break;
    }
    try {
      console.log('Fetching transcript...');
      const transcript = await fetchTranscript(url);
      if (!transcript) {
        console.log('Could not fetch transcript.');
        continue;
      }
      console.log('Transcript fetched. Analyzing with LLM...');
      const analysis = await analyzeTranscript(transcript);
      console.log('Analysis complete. Generating coding prompts...');
      const prompts = await generatePrompts(analysis);

      // Print prompts to console
      console.log('\nGenerated Prompts for Coding Agent:');
      prompts.forEach((p, i) => {
        console.log(`${i + 1}. ${p}`);
      });

      // Write prompts to Markdown file
      const mdContent = [
        `# Coding Prompts for: ${url}`,
        '',
        ...prompts.map((p, i) => `${i + 1}. ${p}`)
      ].join('\n');
      fs.writeFileSync('prompts.md', mdContent, 'utf8');
      console.log('\nPrompts have been saved to prompts.md\n');

      // Interactive follow-up loop
      while (true) {
        const followup = await ask('Ask a follow-up question about the video/prompts, or type "back" to analyze a new video: ');
        if (followup.trim().toLowerCase() === 'back') break;
        if (followup.trim().toLowerCase() === 'exit' || followup.trim().toLowerCase() === 'quit') {
          rl.close();
          return;
        }
        // Use the LLM to answer the follow-up based on the transcript and analysis
        try {
          const followupPrompt = `
You are an expert assistant. The user has watched a YouTube video with the following transcript and analysis:

Transcript:
"""${transcript}"""

Analysis:
${JSON.stringify(analysis, null, 2)}

User's follow-up question:
"${followup}"

Please answer the user's question in detail, referencing the video content and analysis.
`;
          const followupAnswer = await analyzeTranscript(followupPrompt);
          // If the answer is a structured object, print summary/steps, else print as text
          if (typeof followupAnswer === 'object' && followupAnswer.summary) {
            console.log('\nFollow-up Answer:');
            console.log('Summary:', followupAnswer.summary);
            if (Array.isArray(followupAnswer.keyConcepts)) {
              console.log('Key Concepts:', followupAnswer.keyConcepts.join(', '));
            }
            if (Array.isArray(followupAnswer.steps)) {
              console.log('Steps:', followupAnswer.steps.join('\n'));
            }
          } else {
            console.log('\nFollow-up Answer:\n', followupAnswer);
          }
        } catch (err) {
          console.error('Error answering follow-up:', err.message || err);
        }
      }
    } catch (err) {
      console.error('Error:', err.message || err);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

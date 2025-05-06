# AI Agent

This project is an AI agent built in a Node.js environment, fully aligned with MCP server configuration and workspace standards.

## Environment

- Node.js version: 20.11.1 (see `.nvmrc`)
- npm global prefix: `D:/Dev/npm-global`
- npm cache: `D:/Dev/npm-cache`
- All configuration files are local to this project to ensure compatibility with MCP servers and the broader dev environment.

## Setup

1. Use `nvm use` to activate Node.js 20.11.1.
2. All npm installs will use the global prefix and cache on D: as per `.npmrc`.
3. Project directory: `d:/Dev/ai-agent`

## Features

- Robust YouTube transcript retrieval with a 3-step fallback:
  1. Try MCP tool (`get_youtube_video_transcript`)
  2. Fallback to `youtube-transcript-plus` Node.js package
  3. Graceful error if no transcript is available
- Transcript analysis using DeepSeek LLM API (OpenAI-compatible, cost-effective)
- Prompts are generated based on the actual video content
- Prompts are saved to a Markdown file (`prompts.md`) after each analysis
- Interactive CLI: ask follow-up questions about the video/prompts, analyze new videos, or exit at any time

## Prerequisites

- Node.js 20.11.1 (`nvm use` recommended)
- `node-fetch` installed (already included in package.json)
- Internet access for fetching YouTube transcripts and calling the LLM API
- DeepSeek API key (set as `DEEPSEEK_API_KEY` environment variable, or edit `src/llm.js`)

## Usage

1. In this directory, run:

   ```
   node src/agent.js
   ```

2. When prompted, enter a YouTube video URL.

3. The agent will:
   - Fetch the transcript for the video using the fallback strategy
   - Analyze the transcript with DeepSeek LLM
   - Generate a set of prompts for a coding agent based on the video content
   - Save the prompts to `prompts.md`
   - Enter an interactive mode where you can ask follow-up questions or analyze new videos

## Configuration

- To use a different LLM provider, update the endpoint and API key in `src/llm.js`.
- The transcript fallback logic is in `src/youtube.js`.

## Roadmap

- Add persistent conversation history and advanced features
- Support for additional LLM providers (Together, Groq, OpenAI, etc.)
- Enhanced prompt engineering and output formatting
- Optional: export full conversation history to Markdown

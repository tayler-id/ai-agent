# Project Brief: AI Agent for Content Analysis

## 1. Project Title
AI Agent for YouTube Video and GitHub Repository Analysis

## 2. Project Goal
To develop a Node.js command-line AI agent capable of analyzing content from YouTube videos (via transcripts) and public GitHub repositories. The agent will leverage Large Language Models (LLMs) like DeepSeek to understand the content and generate structured analysis and coding prompts.

## 3. Core Requirements
    -   **Input Handling:** Accept YouTube video URLs and public GitHub repository URLs via CLI.
    -   **YouTube Analysis:**
        -   Fetch video transcripts.
        -   Send transcript content to an LLM for analysis (summary, key points, etc.).
        -   Generate coding prompts based on the LLM's analysis.
    -   **GitHub Repository Analysis (New Feature):**
        -   Parse GitHub URLs to identify repository owner and name.
        -   Clone public repositories locally into a temporary directory.
        -   Extract and concatenate content from key files (README, package manifests, selected source files), respecting size limits.
        -   Send concatenated repository content to an LLM with a specialized prompt for analysis (purpose, features, tech stack, potential improvements, build strategy).
        -   Generate a new set of coding prompts based on the LLM's analysis of the repository.
    -   **LLM Integration:** Interact with the DeepSeek API (or other LLMs) for content analysis, managing API keys via environment variables.
    -   **Output:** Save generated prompts and analysis to local files (e.g., `prompts.md`).
    -   **Modularity:** Structure code into logical modules (e.g., agent control, YouTube processing, GitHub processing, LLM interaction, prompt generation).
    -   **Error Handling:** Implement robust error handling for API calls, file operations, and external processes (like `git clone`).
    -   **Resource Management:** Ensure cleanup of temporary files and directories (e.g., cloned repositories).
    -   **User Interaction:** Provide clear CLI prompts and feedback.

## 4. Scope
    -   **Current Focus:**
        -   Implement and test the GitHub repository analysis feature.
        -   Ensure seamless integration with the existing YouTube analysis workflow.
        -   Update documentation (README) for the new feature.
    -   **Future Enhancements (Potential):**
        -   Support for private repositories (with authentication).
        -   More sophisticated file selection heuristics for repository analysis.
        -   Analysis of other content types (e.g., web articles, documents).
        -   Interactive refinement of generated prompts.
        -   Integration with version control for saving analysis results.

## 5. Key Stakeholders
    -   Primary User (driving development and testing)
    -   Cline (AI agent assisting with development)

## 6. Success Criteria
    -   The agent successfully analyzes provided YouTube URLs and generates relevant prompts.
    -   The agent successfully analyzes provided public GitHub repository URLs, clones them, extracts relevant content, and generates insightful analysis and prompts.
    -   The system is robust, handles errors gracefully, and cleans up temporary resources.
    -   The user can easily run the agent and understand its output.
    -   Documentation is clear and up-to-date.

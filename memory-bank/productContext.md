# Product Context: AI Agent for Content Analysis

## 1. Why This Project Exists
This project was initiated to create a versatile command-line tool that automates the process of understanding and deriving insights from different types of online content, specifically YouTube videos and GitHub repositories. The goal is to leverage AI (LLMs) to extract key information and generate useful outputs, such as coding prompts, thereby streamlining initial research and idea generation for development tasks.

## 2. Problems It Solves
-   **Time-Consuming Manual Analysis:** Reduces the manual effort required to watch YouTube videos or sift through GitHub repositories to understand their core concepts, technologies, and potential applications.
-   **Information Overload:** Helps distill large amounts of information (video transcripts, repository code) into concise summaries and actionable insights.
-   **Kickstarting Development:** Generates initial coding prompts based on analyzed content, providing a starting point for new projects or feature development.
-   **Standardizing Analysis:** Provides a consistent approach to analyzing different content sources.

## 3. How It Should Work (User Experience Goals)
-   **Simple CLI Interface:** The user interacts with the agent through simple command-line inputs (providing a URL).
-   **Clear Feedback:** The agent should provide status updates during its operation (e.g., "Cloning repository...", "Analyzing content...", "Prompts saved to prompts.md").
-   **Actionable Output:** The primary output (`prompts.md`) should contain well-structured and useful information that the user can directly apply to their development workflow.
-   **Easy Configuration:** API keys (like `DEEPSEEK_API_KEY`) should be configurable via environment variables.
-   **Reliable Operation:** The agent should handle common errors gracefully (e.g., invalid URLs, API failures, `git` command issues) and provide informative error messages.

## 4. Target Users
-   Software developers, researchers, or content creators who need to quickly understand and extract value from YouTube videos or GitHub repositories.
-   Users who want to leverage LLMs for automated content analysis and prompt generation.

## 5. Value Proposition
-   **Efficiency:** Saves significant time in understanding complex codebases or lengthy videos.
-   **Insight Generation:** Leverages LLMs to uncover insights and connections that might be missed in manual review.
-   **Accelerated Development:** Provides a quick start for coding tasks by generating relevant prompts and analysis.
-   **Versatility:** Handles multiple content types (YouTube, GitHub) through a single interface.

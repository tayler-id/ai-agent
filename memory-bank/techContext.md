# Technical Context: AI Agent for Content Analysis

## 1. Core Technologies
-   **Runtime Environment:** Node.js (version specified in `.nvmrc`, likely a recent LTS version like 18.x or 20.x).
-   **Programming Language:** JavaScript (ES Modules syntax).
-   **Package Manager:** npm (comes with Node.js).

## 2. Key Node.js Modules Used
-   **`readline`:** Core Node.js module for creating command-line interfaces and handling user input asynchronously.
    -   Used in `agent.js` for the main interaction loop.
-   **`fs` (File System):** Core Node.js module for file system operations.
    -   `fs.promises` is used for asynchronous file operations (e.g., `mkdir`, `mkdtemp`, `writeFile`, `readFile`, `rm`).
    -   Used in `agent.js` for ensuring `temp-clones` directory exists.
    -   Used in `github.js` for creating temporary clone directories, reading file contents from cloned repos, and cleaning up.
    -   Used in `agent.js` (or `promptGenerator.js`) for saving output to `prompts.md`.
-   **`path`:** Core Node.js module for working with file and directory paths in a platform-independent way.
    -   Used extensively for constructing paths for temporary directories, cloned files, etc.
-   **`child_process`:** Core Node.js module for spawning child processes.
    -   `exec` function is used (via `util.promisify` to create `execAsync`) in `github.js` to run the `git clone` command.
-   **`util`:** Core Node.js module.
    -   `promisify` is used to convert callback-based functions (like `child_process.exec`) into Promise-based functions.

## 3. External Dependencies (Managed via `package.json`)
-   **`node-fetch` (or similar HTTP client):**
    -   Used in `llm.js` to make HTTP POST requests to the DeepSeek LLM API.
    -   *Assumption: If not `node-fetch`, then another common HTTP client like `axios` might be used.*
-   **Potentially others for YouTube transcript fetching:** The `youtube.js` module might use specific libraries for interacting with YouTube APIs or transcript services.

## 4. External Services and APIs
-   **DeepSeek API:**
    -   Used for LLM-based content analysis.
    -   Requires `DEEPSEEK_API_KEY` environment variable.
    -   Specific endpoint: `https://api.deepseek.com/chat/completions`.
    -   Interacts by sending JSON payloads with prompts and parameters.
-   **GitHub:**
    -   Public repositories are cloned using the standard `git` command-line tool. This implies `git` must be installed on the system where the agent runs and be available in the system's PATH.
-   **YouTube:**
    -   (Existing functionality) Transcript data is fetched, possibly via a dedicated API, a third-party library, or a custom scraping solution.

## 5. Development Setup and Tooling
-   **Version Control:** Git. Project is hosted in a Git repository.
-   **`.nvmrc`:** Specifies the Node.js version for the project, intended for use with NVM (Node Version Manager).
-   **`.npmrc`:** May contain npm configuration specifics for the project.
-   **`package.json`:** Defines project metadata, dependencies, and scripts.
-   **`package-lock.json`:** Ensures reproducible builds by locking dependency versions.
-   **CLI Execution:** The agent is run directly using `node src/agent.js`.

## 6. Technical Constraints & Considerations
-   **`git` Dependency:** The GitHub analysis feature fundamentally relies on the `git` CLI being installed and accessible.
-   **API Key Security:** `DEEPSEEK_API_KEY` must be managed securely as an environment variable and not hardcoded.
-   **Network Connectivity:** Required for cloning GitHub repositories and making API calls to DeepSeek (and YouTube services).
-   **File System Permissions:** The agent needs permissions to create directories (e.g., `temp-clones`), write files (e.g., `prompts.md`), and delete directories within its working scope.
-   **Content Size Limits:** `MAX_FILE_SIZE` and `MAX_TOTAL_CONTENT_SIZE` in `github.js` are crucial for managing LLM token limits and API costs.
-   **Error Handling:** Robust error handling is needed for external process failures (`git clone`), network errors, API errors, and file system issues.
-   **Platform Compatibility:** While Node.js is cross-platform, reliance on the `git` CLI means its availability is a system-level concern. PowerShell is the user's default shell.

## 7. Code Style and Structure
-   **ES Modules:** Uses `import`/`export` syntax.
-   **Modularity:** Code is broken down into specific files based on functionality (`agent.js`, `github.js`, `llm.js`, etc.).
-   **Asynchronous Programming:** Heavy use of `async/await` for non-blocking operations.

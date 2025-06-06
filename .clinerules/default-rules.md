# AI Agent Project Rules

## Cline's Core Operational Principles

### 1. Memory Bank Reliance
- **Critical:** Cline MUST read ALL memory bank files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`, and any other relevant files in `memory-bank/`) at the start of EVERY task. This is not optional and is essential for maintaining context and continuity.

### 2. Planning, Execution, and Reflection Cycle
- **Plan Extensively:** Before each tool use or significant action, Cline MUST plan the steps.
- **Reflect on Outcomes:** After each tool use, Cline MUST reflect on the outcome, incorporating learnings into subsequent steps and updating the Memory Bank if necessary.
- **Self-Improving Reflection:** Before using `attempt_completion` for non-trivial tasks or tasks involving user feedback, Cline MUST offer to reflect on the interaction and suggest improvements to these `.clinerules` if the user agrees.

### 3. Preferred MCP Tool Usage
- **Task Manager Workflow:**
    -   MUST be used for every new multi-step task to plan and track progress (`github.com/pashpashpash/mcp-taskmanager`).
    -   Strictly follow the `mark_task_done` -> `user_approval` -> `get_next_task` cycle for each task defined in the `request_planning` stage.
    -   **Exception for Chained Sub-Operations:** If a single *planned task* from the Task Manager inherently involves a tight sequence of multiple, low-risk, internal sub-operations that *Cline* executes (e.g., a sequence of `git add` then `git commit` performed via `execute_command` as part of a larger "commit feature X" task), Cline MAY perform these chained sub-operations and then mark the single parent task as done, seeking approval once for that parent task. This is to avoid excessive approval steps for trivial, tightly coupled internal actions. Cline MUST still clearly state all sub-operations performed when marking the parent task done. This exception does NOT apply if any sub-operation involves writing/replacing files or has a higher risk.
    -   **Tasks Requiring Elevated Permissions:** If a planned task is likely to require elevated permissions (e.g., `sudo`), Cline SHOULD:
        -   Inform the user of this possibility *before* attempting the command.
        -   Ask if the user has the necessary permissions or if an alternative approach should be considered.
        -   If permissions are lacking and no alternative is immediately viable, mark the task as "blocked" or "skipped due to permissions" and consult the user on how to proceed with the overall goal.
- **Sequential Thinking:** SHOULD be used for complex problem-solving or when a detailed thought process needs to be recorded (`github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking`).
- **Knowledge Graph (Memory MCP):** SHOULD be used to store and retrieve structured knowledge about the project, entities, and relationships (`github.com/modelcontextprotocol/servers/tree/main/src/memory`).
- **Context7:** SHOULD be used for fetching up-to-date library documentation (`github.com/upstash/context7-mcp`). Resolve library ID first.
- **Exa Search:** SHOULD be used for initial research or to back up decision-making before generating task lists for the Task Manager (`github.com/exa-labs/exa-mcp-server`).
- **File System Tools:** ALWAYS use Cline's built-in file system tools (`read_file`, `write_to_file`, `replace_in_file`, `list_files`) for interacting with files, rather than shell commands like `cat` or `ls` unless absolutely necessary for a specific unsupported operation.

### MCP Tool Reliability & Fallbacks
-   While preferred MCP tools should be attempted first, if an MCP tool fails consistently (e.g., 2 consecutive attempts with generic errors) for a common operation (like `git status`, `git add`), Cline SHOULD:
    1.  Note the MCP tool failure.
    2.  Attempt a direct, equivalent `execute_command` if available and safe (e.g., `git status`, `git add`, `git commit`).
    3.  If `execute_command` is not suitable or also fails, then use `ask_followup_question` to request the user to perform the action or provide information.
    4.  After the task, consider noting the unreliable MCP server in `activeContext.md` if it impacts workflow significantly.
-   **Workflow-Critical MCP Failure (e.g., Task Manager):** If an MCP server essential for a core workflow (like Task Manager for multi-step tasks) becomes unavailable:
    1.  Clearly inform the user of the MCP failure and its impact on the standard workflow.
    2.  If possible, identify the remaining planned steps from the last known state of the MCP tool.
    3.  Propose to continue manually with the subsequent logical steps, seeking user confirmation for this adapted approach.
    4.  Document the MCP failure in `activeContext.md` as a significant event.

### Interaction Protocols
- **Strict Tool Adherence:** Even when outlining a multi-step plan or awaiting user input that isn't a direct answer to an `ask_followup_question`, if the turn involves providing information or requesting a distinct next action from the user, ensure a tool is used.
    - If purely waiting for the user to perform an external action they initiate (e.g., an MCP approval, running a local script and providing output), use `ask_followup_question` to confirm completion or request the output of that action.
    - Do not assume an action is complete without confirmation if it's user-driven.

### Debugging Workflow / Terminal Output Handling
- **Processing User-Provided Terminal Output:** If the user provides terminal output directly in their message, process it immediately.
- **Responding to "Read Terminal" Prompts:** If the user asks "can you read the terminal?" or similar:
    1. First, check `environment_details.Actively Running Terminals` for any *new* output since the last interaction, especially if an `execute_command` was recently run by me or if the user implies they've just performed an action.
    2. If new, relevant output is found there, process it.
    3. If no new relevant output is found in `environment_details`, or if clarity is needed, use `ask_followup_question` to explicitly request the user to provide the specific new terminal output they are referring to.

---

## Test Output Clarity
- When running test scripts or integration checks, ensure that all output is human-readable and actionable.
- Do not log raw object references (e.g., Promise, Iterator, or RecordBatchIterator objects) without materializing and displaying their contents.
- For async iterators or database query results, always await and print the actual records or results, not just the iterator object.
- If a test script does not provide clear output, update it to do so before considering the test complete.

## Core Dependencies & Setup
-   **`git` CLI:** This agent's GitHub analysis feature relies on the `git` command-line tool being installed and accessible in the system's PATH. Cloning will fail otherwise.
-   **`DEEPSEEK_API_KEY`:** This environment variable must be set with a valid DeepSeek API key for LLM analysis to function.
    -   In PowerShell for a session: `$env:DEEPSEEK_API_KEY = "YOUR_KEY_HERE"`
-   **Multiple API Provider Management (e.g., LLMs):**
    -   When supporting multiple similar external API providers (e.g., DeepSeek and OpenAI for LLM tasks), ensure clear and consistent configuration for API keys (prefer `.env` for all keys like `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`).
    -   Implement a straightforward mechanism for selecting the active provider (e.g., via `config.json` model name prefixes or a dedicated provider setting).
    -   Ensure code robustly loads and uses the correct key for the selected provider.
-   **Node.js Version:** Adhere to the version specified in `.nvmrc`. Use `nvm use` (and specify the version explicitly in chained PowerShell commands, e.g., `nvm use 20.11.1; npm install`).
-   **Temporary Files:** The agent creates temporary directories under `ai-agent/temp-clones/` for cloned repositories. These should be automatically cleaned up by `github.js -> cleanupRepo()`. Monitor this if issues arise.

## Development & Testing
-   **Modular Structure:** Maintain the modular design (`agent.js`, `github.js`, `youtube.js`, `llm.js`, `promptGenerator.js`).
-   **Error Handling:** Ensure robust error handling for external processes (`git clone`), API calls, and file system operations. Provide clear error messages.
-   **Content Limits:** Be mindful of `MAX_FILE_SIZE` and `MAX_TOTAL_CONTENT_SIZE` in `github.js` when testing with large repositories to manage LLM token usage and API costs.
-   **Output:** Generated analysis and prompts are saved to `prompts.md`.

### User-Led Testing Protocol for UI/Interactive Features

When a task requires user interaction with a UI or an external system that Cline cannot directly control (e.g., testing a chat interface, running a local script with prompts):

1.  **Clear Test Plan:** Cline MUST provide a clear, step-by-step test plan if multiple test cases are needed. Each test case should specify:
    *   The action the user needs to perform.
    *   An example of the input/query if applicable.
    *   The specific outputs/logs Cline needs from the user to verify the test (e.g., "server console logs for LVM search," "LLM's response in the UI").
2.  **Iterative Test Execution:** Cline SHOULD request the user to perform one test case (or a small group of related test cases) at a time.
3.  **Explicit Request for Results:** After the user performs the action, Cline MUST explicitly ask for all necessary outputs/logs for that specific test case using `ask_followup_question`.
4.  **Confirmation of Understanding:** If the user's response is ambiguous or doesn't provide all requested information (e.g., "tell me," "you run it"), Cline MUST clarify what actions are needed from the user and what specific information is required, referencing the test plan. Avoid proceeding if the necessary test data is not yet provided.
5.  **Analysis and Iteration:** Cline will analyze the provided results. If a test fails or shows unexpected behavior, Cline will diagnose and propose fixes before re-requesting a test.

## Cline's Interaction
-   Cline can execute the command to *start* the agent (e.g., `node src/agent.js`).
-   Cline **cannot** interact with the agent's subsequent CLI prompts (e.g., typing in a URL when the agent asks). The user must perform these interactions.
-   Provide console output to Cline for debugging if issues occur during user-led testing.

## Continuous Improvement & Integration Lessons
- After moving or refactoring files, always verify import paths in all affected modules.
- When integrating third-party libraries, check and match API method names to the official documentation (e.g., camelCase vs snake_case).
- When wrapping third-party APIs, error handling should be specific to error types/messages, not broad catch-alls. Always check error messages/types before attempting resource creation (e.g., only create a DB table if the error indicates "not found").
- When using environment variables for secrets (like API keys), tests should clearly warn and fail gracefully if not set.
- After any test or integration failure, update .clinerules with the root cause and the fix, to prevent recurrence.

---

## Codebase & Memory Bank Synchronization Protocol

When a significant discrepancy is identified between the live codebase and the Memory Bank documentation, or upon user request for a full audit, the following protocol should be initiated:

1.  **Acknowledge & Plan:**
    *   Acknowledge the desynchronization.
    *   Use the Task Manager (`github.com/pashpashpash/mcp-taskmanager`) to create a detailed plan for the audit and update process. This plan should include:
        *   Listing/identifying key source code modules.
        *   Reading relevant source files.
        *   Analyzing the codebase to understand current state (architecture, features, tech).
        *   Systematically updating EACH core Memory Bank file (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).
        *   Updating the Knowledge Graph (`github.com/modelcontextprotocol/servers/tree/main/src/memory`) with new/changed entities and relations.
        *   Providing a comprehensive updated project overview post-audit.
        *   Committing and pushing all Memory Bank changes to version control.

2.  **Execution & Verification:**
    *   Execute tasks sequentially, seeking user approval via the Task Manager at each critical step (e.g., after file reading, after analysis, after each Memory Bank file update).
    *   Use `write_to_file` for comprehensive Memory Bank document rewrites if changes are substantial, rather than many small `replace_in_file` operations.
    *   Ensure the `activeContext.md` clearly states that an audit is in progress and then reflects the post-audit roadmap.
    *   Ensure `progress.md` is updated to accurately list "Actually Completed & Implemented Features" based *only* on the audit findings.

3.  **Post-Audit:**
    *   The updated Memory Bank becomes the new source of truth.
    *   Offer reflection on the audit process itself for potential `.clinerules` refinement.

# Improvement & Re-implementation Blueprint for Local Project: D:\Dev\crypto-trading-assistant

## Original Project Summary
### Purpose
Automate cryptocurrency trading decisions and execution using AI analysis and API integrations with Alpaca for trading, CoinGecko for market data, and Google Gemini for AI recommendations.

### Core Mechanics/Concepts
- Periodic (every 5 minutes) fetching of account balance and market data
- Calculation of technical indicators (SMA7, SMA50)
- AI-driven trading recommendation generation via Gemini API
- Trade execution based on recommendations with position checks and fixed notional amounts
- Error handling with retry logic for API calls

## Suggested Enhanced Version
### Concept for Enhancement
A modular, production-ready crypto trading bot with enhanced risk management, multi-asset support, and a configurable rules engine that can combine AI recommendations with technical indicators.

### Key Enhancements & Actionable Steps
#### 1. Modular Architecture with Strategy Pattern
**Description:** Refactor the monolithic index.js into separate modules for data fetching, analysis, trading strategies, and execution. Implement the Strategy pattern to allow different trading strategies to be plugged in.
**Reasoning:** Improves maintainability, testability, and allows for easier addition of new trading strategies or data sources without modifying core logic.
**Actionable Steps for Coding Agent:**
  - Create new directories: src/modules/data, src/modules/analysis, src/modules/strategies, src/modules/execution
  - Move existing functionality into appropriate modules with clear interfaces
  - Implement base Strategy class with common interface methods
  - Convert current AI+indicator logic into first concrete strategy implementation
  - Update main index.js to use dependency injection for strategy selection
**Builds upon/replaces:** Current monolithic index.js handling all logic, Hardcoded SMA calculations and AI prompt in single file

#### 2. Enhanced Risk Management System
**Description:** Implement comprehensive risk controls including position sizing rules, stop-loss/take-profit mechanisms, and portfolio-level risk limits.
**Reasoning:** The current fixed $100 notional amount and basic position check are insufficient for production use. Proper risk management is critical for automated trading systems.
**Actionable Steps for Coding Agent:**
  - Create src/modules/risk with RiskManager class
  - Implement position sizing based on percentage of portfolio and volatility
  - Add stop-loss/take-profit order support in execution module
  - Integrate daily loss limits and drawdown protection
  - Make risk parameters configurable via .env
**Builds upon/replaces:** Current fixed $100 notional amount in executeTrade(), Basic position check before buying

### Suggested Tech Stack for Enhanced Version
- Node.js (maintained from original)
- TypeScript (add for better type safety)
- Jest (for unit testing)
- Redis (for caching market data and state management)
- Express (optional, for monitoring API)

### Critical Files to Create/Modify for Enhanced Version
- src/modules/strategies/AIStrategy.ts (new strategy implementation)
- src/modules/risk/RiskManager.ts (new risk system)
- src/config/strategies.config.json (strategy configurations)
- src/index.ts (refactored main entry point)
- tests/unit/* (new test files)


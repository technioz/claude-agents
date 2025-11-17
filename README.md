# @technioz/claude-agents

> Multi-platform, multi-agent orchestration system - Complete SDLC automation with 9 specialized agents for Claude Code, Cursor, and more

[![npm version](https://img.shields.io/npm/v/@technioz/claude-agents.svg)](https://www.npmjs.com/package/@technioz/claude-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@technioz/claude-agents.svg)](https://nodejs.org)

## 🎉 What's New in v1.2.0

**Multi-Platform Support!** 🚀

- ✅ **Claude Code & Cursor** - Now supports both platforms with a single codebase
- ✅ **Platform Registry** - Scalable architecture for easy addition of future platforms (Codex, etc.)
- ✅ **Platform Flags** - Use `--claude`, `--cursor`, or `--platform` with all commands
- ✅ **Coexistence** - Install agents for multiple platforms in the same project
- ✅ **Backward Compatible** - Defaults to Claude Code, no breaking changes

[View Changelog](CHANGELOG.md) | [Full Release Notes](https://github.com/technioz/claude-agents/releases/tag/v1.2.0)

## 🚀 What is Claude Agents?

Claude Agents is a powerful multi-platform, multi-agent orchestration system designed to work with Claude Code, Cursor, and other AI-powered development environments. It provides a complete Software Development Life Cycle (SDLC) automation through 9 specialized AI agents that work together to build, test, secure, and deploy your applications.

### Supported Platforms

- **🤖 Claude Code** - Anthropic Claude integration (default)
- **🖱️ Cursor** - Cursor IDE integration
- *More platforms coming soon...*

### The 9 Agents

1. **ARCHITECT** - Design system architecture, component structure, and data flow
2. **DEVELOPER** - Write clean, type-safe code implementing designs
3. **DESIGNER** - Create UI components using shadcn/ui
4. **INTEGRATIONS** - Manage external API connections (OpenAI, Anthropic, Groq, etc.)
5. **TESTING** - Ensure code quality through automated testing
6. **SECURITY-and-PRODUCTION-READINESS** - Security review and production readiness validation
7. **DEPLOYMENT** - Manage production deployment and CI/CD
8. **DOCUMENTATION** - Keep documentation current and comprehensive
9. **ORCHESTRATOR** - Master controller that delegates tasks to all agents

## 📦 Installation

### Quick Start

```bash
# Install globally
npm install -g @technioz/claude-agents

# Or use npx (no installation required)
npx @technioz/claude-agents init
```

### Initialize Agents in Your Project

```bash
# Interactive setup (recommended) - will prompt for platform
claude-agents init

# Install for Claude Code (default)
claude-agents init --claude

# Install for Cursor
claude-agents init --cursor

# Install all agents locally
claude-agents init --local

# Install all agents globally
claude-agents init --global

# Install specific agents
claude-agents init --agents ARCHITECT DEVELOPER DESIGNER

# Install for Cursor with specific agents
claude-agents init --cursor --agents ARCHITECT DEVELOPER

# Skip prompts and install all agents (defaults to Claude Code)
claude-agents init --yes
```

## 🎯 Features

- ✅ **Multi-Platform Support** - Works with Claude Code, Cursor, and more
- ✅ **Complete SDLC Coverage** - From architecture to deployment
- ✅ **Interactive CLI** - User-friendly setup wizard
- ✅ **Flexible Installation** - Global or project-specific agents
- ✅ **Selective Installation** - Choose which agents you need
- ✅ **Easy Updates** - Keep agents up to date with one command
- ✅ **Custom Agents** - Create your own specialized agents
- ✅ **Validation** - Ensure agent files are correctly formatted
- ✅ **Comprehensive Documentation** - Includes AGENTS_PROTOCOL.md

## 📚 Usage

### Available Commands

#### `init` - Initialize Agents

Install agents in your project or globally.

```bash
# Interactive setup (prompts for platform)
claude-agents init

# Platform selection
claude-agents init --claude          # Use Claude Code (default)
claude-agents init --cursor          # Use Cursor
claude-agents init --platform cursor # Specify platform explicitly

# Installation location
claude-agents init --global          # Install globally
claude-agents init --local            # Install locally

# Agent selection
claude-agents init --agents A B C    # Install specific agents
claude-agents init --yes             # Skip prompts, install all

# Combined example
claude-agents init --cursor --local --agents ARCHITECT DEVELOPER
```

#### `list` - List Agents

View all available or installed agents.

```bash
# List all available agents
claude-agents list

# List installed agents (shows all platforms if no platform specified)
claude-agents list --installed

# List installed agents for specific platform
claude-agents list --installed --claude
claude-agents list --installed --cursor
```

#### `update` - Update Agents

Update existing agents to the latest version.

```bash
# Interactive update (prompts for platform)
claude-agents update

# Update for specific platform
claude-agents update --claude
claude-agents update --cursor

# Update global agents
claude-agents update --global

# Update local agents
claude-agents update --local

# Update specific agents
claude-agents update --agents ARCHITECT DEVELOPER

# Combined example
claude-agents update --cursor --local --agents ARCHITECT
```

#### `create` - Create Custom Agent

Create a new custom agent from template.

```bash
# Interactive creation (prompts for platform)
claude-agents create MY-CUSTOM-AGENT

# Create for specific platform
claude-agents create MY-CUSTOM-AGENT --claude
claude-agents create MY-CUSTOM-AGENT --cursor

# Create in global directory
claude-agents create MY-CUSTOM-AGENT --global

# Create in local directory
claude-agents create MY-CUSTOM-AGENT --local

# Combined example
claude-agents create MY-CUSTOM-AGENT --cursor --local
```

#### `validate` - Validate Configuration

Validate agent configuration files.

```bash
# Validate local agents (defaults to Claude Code)
claude-agents validate

# Validate for specific platform
claude-agents validate --claude
claude-agents validate --cursor

# Validate global agents
claude-agents validate --global

# Validate local agents
claude-agents validate --local

# Validate specific path (overrides platform)
claude-agents validate --path /path/to/agents
```

## 🏗️ Agent Architecture

### Development Pipeline Flow

```
1. ARCHITECT → Design system architecture
2. DESIGNER → Create UI component specifications
3. DEVELOPER → Implement components
4. INTEGRATIONS → Build API providers (can run parallel with #3)
5. TESTING → Write and run tests
6. SECURITY-and-PRODUCTION-READINESS → Security review (MANDATORY GATE)
   ├─ APPROVED → Proceed to #7
   ├─ CONDITIONAL → Fix issues, re-review
   └─ REJECTED → Fix critical issues, re-review
7. DOCUMENTATION → Document features
8. DEPLOYMENT → Deploy to production (ONLY after security approval)
```

### Communication Protocol

All agents communicate using a structured JSON protocol:

- **TASK_ASSIGNMENT** - ORCHESTRATOR delegates work
- **TASK_ACKNOWLEDGMENT** - Agent confirms receipt
- **TASK_COMPLETION** - Agent reports finished work
- **TASK_REJECTION** - ORCHESTRATOR requests fixes
- **BLOCKER_ESCALATION** - Agent reports blockers
- **BLOCKER_RESOLUTION** - ORCHESTRATOR resolves blockers

See `AGENTS_PROTOCOL.md` for complete protocol specification.

## 📖 Documentation

### File Structure

After installation, agents are stored in platform-specific directories:

**Claude Code (default):**
```
.claude/
├── agents/
│   ├── ARCHITECT.md
│   ├── DEVELOPER.md
│   ├── DESIGNER.md
│   ├── INTEGRATIONS.md
│   ├── TESTING.md
│   ├── SECURITY-and-PRODUCTION-READINESS.md
│   ├── DEPLOYMENT.md
│   ├── DOCUMENTATION.md
│   └── ORCHESTRATOR.md
└── AGENTS_PROTOCOL.md
```

**Cursor:**
```
.cursor/
├── agents/
│   ├── ARCHITECT.md
│   ├── DEVELOPER.md
│   └── ... (same agent files)
└── AGENTS_PROTOCOL.md
```

You can have agents installed for multiple platforms simultaneously. Each platform maintains its own directory structure.

### Agent Metadata

Each agent includes:
- **name** - Agent identifier
- **description** - Purpose and role
- **model** - AI model to use (sonnet, opus, haiku)
- **color** - Display color in Claude Code

### Customization

You can customize agents by editing their `.md` files:

1. Modify the agent's **Purpose** and **Duty**
2. Update **Instructions** for specific behavior
3. Add or remove **Capabilities**
4. Define **Limits** and constraints
5. Customize **Communication Protocol** responses

## 🎨 Creating Custom Agents

Create specialized agents for your specific needs:

```bash
claude-agents create DATA-ANALYST
```

The CLI will guide you through:
1. Setting description
2. Choosing AI model
3. Selecting color
4. Configuring capabilities

Then edit the generated file to add:
- Specific instructions
- Domain knowledge
- Integration patterns
- Success criteria

## 🔒 Security Gate

The **SECURITY-and-PRODUCTION-READINESS** agent acts as a mandatory quality gate:

### What it checks:
- ✅ Security vulnerabilities (SQL injection, XSS, CSRF)
- ✅ Production readiness (env vars, error handling, logging)
- ✅ Scalability (database optimization, caching, rate limiting)
- ✅ Code robustness (error handling, retry logic, timeouts)
- ✅ Dependency vulnerabilities

### Approval Status:
- **APPROVED** - Code can be deployed
- **CONDITIONAL** - Minor issues, fix before production
- **REJECTED** - Critical issues, deployment blocked

**Critical Rule**: NO deployment without SECURITY_AUDITOR approval!

## 💡 Examples

### Example 1: Full Feature Development

```bash
# Initialize all agents for Claude Code
claude-agents init --yes

# Or for Cursor
claude-agents init --cursor --yes

# Start your IDE (Claude Code or Cursor) and request a feature
# "Build a chat interface with model selector"

# Agents will automatically:
# 1. ARCHITECT designs the system
# 2. DESIGNER creates UI specs
# 3. DEVELOPER implements code
# 4. INTEGRATIONS adds API providers
# 5. TESTING writes tests
# 6. SECURITY reviews everything
# 7. DOCUMENTATION documents it
# 8. DEPLOYMENT deploys to production
```

### Example 2: Security Review Only

```bash
# Install just security agent for Claude Code
claude-agents init --agents SECURITY-and-PRODUCTION-READINESS

# Or for Cursor
claude-agents init --cursor --agents SECURITY-and-PRODUCTION-READINESS

# Use in your IDE for security audits
```

### Example 3: Update Workflow

```bash
# Check for new agent versions
claude-agents list --installed

# Update all agents for Claude Code
claude-agents update --claude --yes

# Update all agents for Cursor
claude-agents update --cursor --yes

# Validate after update
claude-agents validate --claude
claude-agents validate --cursor
```

### Example 4: Multi-Platform Setup

```bash
# Install for both platforms in the same project
claude-agents init --claude --local --agents ARCHITECT DEVELOPER
claude-agents init --cursor --local --agents ARCHITECT DEVELOPER

# List agents from all platforms
claude-agents list --installed

# Work with platform-specific commands
claude-agents update --claude --local
claude-agents update --cursor --local
```

## 🛠️ Development

### Local Development

```bash
# Clone repository
git clone https://github.com/technioz/claude-agents.git
cd claude-agents

# Install dependencies
npm install

# Link for local testing
npm link

# Test CLI
claude-agents --help
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **GitHub**: https://github.com/technioz/claude-agents
- **npm**: https://www.npmjs.com/package/@technioz/claude-agents
- **Issues**: https://github.com/technioz/claude-agents/issues
- **Claude Code**: https://claude.com/claude-code
- **Cursor**: https://cursor.sh

## 🙏 Acknowledgments

- Built for use with [Claude Code](https://claude.com/claude-code) and [Cursor](https://cursor.sh)
- Inspired by multi-agent systems and SDLC automation
- Uses [shadcn/ui](https://ui.shadcn.com/) design patterns

## 📊 Project Stats

- 🤖 **9 Specialized Agents**
- 🌐 **Multi-Platform Support** (Claude Code, Cursor, and more)
- 📦 **Zero Configuration** needed
- 🔄 **Complete SDLC** coverage
- ✅ **Production Ready**
- 🏗️ **Scalable Architecture** - Easy to add new platforms

## 🚀 Roadmap

- [x] **Multi-platform support** (Claude Code & Cursor) - ✅ v1.2.0
- [ ] Additional platform support (Codex, etc.)
- [ ] Agent marketplace for community templates
- [ ] Visual workflow designer
- [ ] Integration with popular CI/CD platforms
- [ ] Real-time collaboration features
- [ ] Performance analytics dashboard
- [ ] Multi-language support

## 💬 Support

- 📧 Email: support@technioz.com
- 💬 GitHub Discussions: https://github.com/technioz/claude-agents/discussions
- 🐛 Bug Reports: https://github.com/technioz/claude-agents/issues

---

**Made by developers for developers**

*Automate your SDLC with intelligent AI agents!*

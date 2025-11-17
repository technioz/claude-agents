# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-09

### Added
- Initial release of @technioz/claude-agents
- 9 specialized AI agents for complete SDLC automation:
  - ARCHITECT - System architecture design
  - DEVELOPER - Code implementation
  - DESIGNER - UI component design
  - INTEGRATIONS - External API management
  - TESTING - Quality assurance
  - SECURITY-and-PRODUCTION-READINESS - Security review
  - DEPLOYMENT - Production deployment
  - DOCUMENTATION - Documentation management
  - ORCHESTRATOR - Master controller
- CLI commands:
  - `init` - Initialize agents in project
  - `list` - List available and installed agents
  - `update` - Update agents to latest version
  - `create` - Create custom agents
  - `validate` - Validate agent configuration
- Interactive setup wizard with inquirer
- Support for both global (~/.claude/agents) and local (./.claude/agents) installation
- Selective agent installation
- Custom agent creation from template
- Agent validation
- Comprehensive AGENTS_PROTOCOL.md documentation
- Complete README with usage examples
- MIT License

### Features
- Zero-configuration setup
- Colored CLI output with chalk and ora
- File operations with fs-extra
- Structured JSON communication protocol
- Security gate enforcement
- Production readiness checks
- Scalability assessment
- Complete SDLC coverage

### Documentation
- Comprehensive README.md
- AGENTS_PROTOCOL.md communication specification
- Individual agent documentation for all 9 agents
- Custom agent template
- Usage examples

## [1.1.0] - 2025-11-18

### Added
- **Multi-platform support** - Now supports Claude Code and Cursor platforms
- Platform registry system for easy addition of future platforms (Codex, etc.)
- Platform selection flags: `--claude`, `--cursor`, `--platform <platform>`
- Platform-specific directory structure (`.claude/agents` and `.cursor/agents`)
- Multi-platform coexistence - agents can be installed for multiple platforms simultaneously
- Platform-aware CLI commands - all commands now support platform selection
- `src/utils/platforms.js` - Centralized platform configuration registry

### Changed
- Updated all commands to support platform parameter
- File operations now use platform-specific paths
- CLI banner updated to reflect multi-platform support
- Custom agent template made platform-agnostic (removed "Claude" reference)
- Default platform remains Claude Code for backward compatibility

### Technical
- Refactored file operations to accept platform parameter
- Added platform abstraction layer for scalable architecture
- Updated prompts to include platform selection
- Enhanced list command to show agents across all platforms

## [Unreleased]

### Planned
- Agent marketplace for community templates
- Visual workflow designer
- Integration with popular CI/CD platforms
- Real-time collaboration features
- Performance analytics dashboard
- Multi-language support
- Web dashboard for agent management
- VS Code extension
- GitHub Actions integration
- Docker support

---

For detailed information about changes, see the [GitHub releases page](https://github.com/technioz/claude-agents/releases).

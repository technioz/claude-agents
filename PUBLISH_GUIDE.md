# 🚀 Quick Publish Guide

This guide will help you publish `@technioz/claude-agents` to npm and GitHub.

---

## Prerequisites

✅ Git installed
✅ Node.js 16+ installed
✅ npm account created at https://www.npmjs.com/signup
✅ GitHub account

---

## Step 1: Push to GitHub (5 minutes)

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `claude-agents`
3. Description: "Multi-agent orchestration system for Claude Code - Complete SDLC automation"
4. Visibility: Public
5. DO NOT initialize with README (we already have one)
6. Click "Create repository"

### Push Code to GitHub

```bash
cd /Users/gauravbhatia/Technioz/ai-agents/claude-agents

# Add remote
git remote add origin https://github.com/technioz/claude-agents.git

# Push code
git branch -M main
git push -u origin main
```

### Verify

Visit https://github.com/technioz/claude-agents to see your code.

---

## Step 2: Publish to npm (5 minutes)

### Login to npm

```bash
# Login (will prompt for username, password, email)
npm login

# Verify login
npm whoami
```

### Check Package Name Availability

```bash
# Should return 404 if available
npm view @technioz/claude-agents
```

If name is taken, update `package.json` with a different name.

### Publish

```bash
# Dry run to see what will be published
npm publish --dry-run

# Review the file list, then publish
npm publish --access public
```

### Verify Publication

```bash
# Check package on npm
npm view @technioz/claude-agents

# Should show version 1.0.0 and your package details
```

Visit https://www.npmjs.com/package/@technioz/claude-agents

---

## Step 3: Test Installation (2 minutes)

### Test Global Installation

```bash
# In a new directory
mkdir /tmp/test-claude-agents
cd /tmp/test-claude-agents

# Install from npm
npm install -g @technioz/claude-agents

# Test commands
claude-agents --version
claude-agents list
claude-agents init --help
```

### Test Local Installation

```bash
# Test in a project
mkdir test-project
cd test-project
npm init -y
npx @technioz/claude-agents init --help
```

---

## Step 4: Create GitHub Release (5 minutes)

1. Go to https://github.com/technioz/claude-agents/releases
2. Click "Draft a new release"
3. Click "Choose a tag" → type `v1.0.0` → "Create new tag"
4. Release title: `v1.0.0 - Initial Release 🎉`
5. Description (copy from CHANGELOG.md):

```markdown
## 🎉 Initial Release

Multi-agent orchestration system for Claude Code with complete SDLC automation!

### ✨ Features

- 9 specialized AI agents for complete SDLC automation
- Interactive CLI with setup wizard
- Support for global and local installation
- Custom agent creation
- Agent validation
- Comprehensive documentation

### 🤖 The 9 Agents

1. **ARCHITECT** - Design system architecture
2. **DEVELOPER** - Write clean, type-safe code
3. **DESIGNER** - Create UI components (shadcn/ui)
4. **INTEGRATIONS** - Manage external APIs
5. **TESTING** - Quality assurance
6. **SECURITY-and-PRODUCTION-READINESS** - Security review
7. **DEPLOYMENT** - Production deployment
8. **DOCUMENTATION** - Documentation management
9. **ORCHESTRATOR** - Master controller

### 📦 Installation

```bash
# Install globally
npm install -g @technioz/claude-agents

# Or use npx
npx @technioz/claude-agents init
```

### 📚 Documentation

- [README](https://github.com/technioz/claude-agents#readme)
- [AGENTS_PROTOCOL](https://github.com/technioz/claude-agents/blob/main/templates/AGENTS_PROTOCOL.md)

### 🔗 Links

- npm: https://www.npmjs.com/package/@technioz/claude-agents
- GitHub: https://github.com/technioz/claude-agents
```

6. Click "Publish release"

---

## Step 5: Update README Badges (2 minutes)

Edit README.md and update badges:

```markdown
[![npm version](https://img.shields.io/npm/v/@technioz/claude-agents.svg)](https://www.npmjs.com/package/@technioz/claude-agents)
[![npm downloads](https://img.shields.io/npm/dm/@technioz/claude-agents.svg)](https://www.npmjs.com/package/@technioz/claude-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/technioz/claude-agents.svg)](https://github.com/technioz/claude-agents/stargazers)
```

Then commit and push:

```bash
git add README.md
git commit -m "Update README badges"
git push
```

---

## Step 6: Promote Your Package (Optional)

### Social Media

**Twitter/X:**
```
🚀 Just published @technioz/claude-agents v1.0.0!

A multi-agent orchestration system for Claude Code with 9 specialized AI agents that automate your entire SDLC:

✅ Architecture
✅ Development
✅ Testing
✅ Security
✅ Deployment
✅ and more!

Try it: npm install -g @technioz/claude-agents

#AI #DevTools #Automation
```

**LinkedIn:**
```
I'm excited to announce the release of @technioz/claude-agents! 🎉

It's a multi-agent orchestration system that brings complete SDLC automation to Claude Code through 9 specialized AI agents.

Key features:
• Complete development pipeline automation
• Security gate enforcement
• Production readiness validation
• Custom agent creation
• Interactive CLI

Check it out: https://www.npmjs.com/package/@technioz/claude-agents

#SoftwareDevelopment #AI #DevOps #Automation
```

### Communities

Post on:
- [ ] Reddit: r/programming, r/node, r/opensource
- [ ] Dev.to: Write a blog post
- [ ] Hacker News
- [ ] ProductHunt

### Blog Post Outline

Title: "Building a Multi-Agent System for Complete SDLC Automation"

1. The Problem
2. The Solution
3. Architecture
4. The 9 Agents
5. How It Works
6. Getting Started
7. Future Plans

---

## ✅ Post-Publish Checklist

After publishing, verify:

- [ ] Package visible on npmjs.com
- [ ] GitHub repository public and accessible
- [ ] README displays correctly on GitHub
- [ ] README displays correctly on npmjs.com
- [ ] All badges working
- [ ] Installation works: `npm install -g @technioz/claude-agents`
- [ ] Commands work: `claude-agents --help`
- [ ] GitHub release created
- [ ] Social media posts shared (optional)

---

## 📊 Monitor Success

### Track Metrics

1. **npm downloads**: https://www.npmjs.com/package/@technioz/claude-agents
2. **GitHub stars**: https://github.com/technioz/claude-agents/stargazers
3. **GitHub issues**: https://github.com/technioz/claude-agents/issues
4. **npm weekly downloads**: Check your npm dashboard

### Respond to Feedback

- Monitor GitHub issues
- Respond to questions
- Fix bugs promptly
- Consider feature requests

---

## 🎯 What's Next?

After successful publication:

1. **Monitor for issues** in the first 24 hours
2. **Respond to early users**
3. **Fix any critical bugs** → patch release (v1.0.1)
4. **Plan next features** for v1.1.0
5. **Build community** around the project

---

## 🆘 Troubleshooting

### "Package name already taken"

Change package name in `package.json`:
```json
"name": "@technioz/claude-dev-agents"
```

### "Not logged in to npm"

Run `npm login` and enter credentials.

### "403 Forbidden"

Your package name might need scoping. Use `@yourusername/package-name`.

### "Module not found"

Check `package.json` "bin" and "main" fields are correct.

---

## 🎉 Success!

Once published, your package is live and anyone can install it with:

```bash
npm install -g @technioz/claude-agents
```

**Congratulations! 🚀**

---

## Support

Questions? Open an issue on GitHub:
https://github.com/technioz/claude-agents/issues

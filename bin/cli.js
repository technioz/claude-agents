#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

// Import commands
const { init } = require('../src/commands/init');
const { update } = require('../src/commands/update');
const { list } = require('../src/commands/list');
const { create } = require('../src/commands/create');
const { validate } = require('../src/commands/validate');

// Display banner
console.log(chalk.blue.bold('\n🤖 Claude Agents CLI'));
console.log(chalk.gray('Multi-agent orchestration system for Claude Code\n'));

program
  .name('claude-agents')
  .description('Multi-agent orchestration system for Claude Code')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize Claude agents in your project')
  .option('-g, --global', 'Install agents globally (~/.claude/agents)')
  .option('-l, --local', 'Install agents locally (./.claude/agents)')
  .option('-a, --agents <agents...>', 'Select specific agents to install (e.g., ARCHITECT DEVELOPER)')
  .option('-y, --yes', 'Skip prompts and install all agents')
  .action(init);

// Update command
program
  .command('update')
  .description('Update existing agents to latest version')
  .option('-g, --global', 'Update global agents')
  .option('-l, --local', 'Update local agents')
  .option('-a, --agents <agents...>', 'Update specific agents only')
  .action(update);

// List command
program
  .command('list')
  .description('List all available agents with descriptions')
  .option('-i, --installed', 'Show only installed agents')
  .action(list);

// Create command
program
  .command('create <name>')
  .description('Create a new custom agent from template')
  .option('-g, --global', 'Create in global agents directory')
  .option('-l, --local', 'Create in local agents directory')
  .action(create);

// Validate command
program
  .command('validate')
  .description('Validate agent configuration files')
  .option('-p, --path <path>', 'Path to agents directory (default: ./.claude/agents)')
  .option('-g, --global', 'Validate global agents directory')
  .action(validate);

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

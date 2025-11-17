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
console.log(chalk.blue.bold('\n🤖 Multi-Platform Agents CLI'));
console.log(chalk.gray('Multi-agent orchestration system for Claude Code, Cursor, and more\n'));

program
  .name('claude-agents')
  .description('Multi-agent orchestration system supporting multiple platforms')
  .version('1.1.0');

// Init command
program
  .command('init')
  .description('Initialize agents in your project')
  .option('-g, --global', 'Install agents globally')
  .option('-l, --local', 'Install agents locally')
  .option('--claude', 'Use Claude Code platform (default)')
  .option('--cursor', 'Use Cursor platform')
  .option('-p, --platform <platform>', 'Specify platform: claude or cursor')
  .option('-a, --agents <agents...>', 'Select specific agents to install (e.g., ARCHITECT DEVELOPER)')
  .option('-y, --yes', 'Skip prompts and install all agents')
  .action(init);

// Update command
program
  .command('update')
  .description('Update existing agents to latest version')
  .option('-g, --global', 'Update global agents')
  .option('-l, --local', 'Update local agents')
  .option('--claude', 'Use Claude Code platform (default)')
  .option('--cursor', 'Use Cursor platform')
  .option('-p, --platform <platform>', 'Specify platform: claude or cursor')
  .option('-a, --agents <agents...>', 'Update specific agents only')
  .action(update);

// List command
program
  .command('list')
  .description('List all available agents with descriptions')
  .option('-i, --installed', 'Show only installed agents')
  .option('--claude', 'Use Claude Code platform (default)')
  .option('--cursor', 'Use Cursor platform')
  .option('-p, --platform <platform>', 'Specify platform: claude or cursor')
  .action(list);

// Create command
program
  .command('create <name>')
  .description('Create a new custom agent from template')
  .option('-g, --global', 'Create in global agents directory')
  .option('-l, --local', 'Create in local agents directory')
  .option('--claude', 'Use Claude Code platform (default)')
  .option('--cursor', 'Use Cursor platform')
  .option('-p, --platform <platform>', 'Specify platform: claude or cursor')
  .action(create);

// Validate command
program
  .command('validate')
  .description('Validate agent configuration files')
  .option('--path <path>', 'Path to agents directory (overrides platform/location)')
  .option('-g, --global', 'Validate global agents directory')
  .option('-l, --local', 'Validate local agents directory')
  .option('--claude', 'Use Claude Code platform (default)')
  .option('--cursor', 'Use Cursor platform')
  .option('-p, --platform <platform>', 'Specify platform: claude or cursor')
  .action(validate);

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

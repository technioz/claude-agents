const chalk = require('chalk');
const { getInstalledAgents } = require('../utils/fileOperations');
const { AVAILABLE_AGENTS } = require('../utils/prompts');
const Logger = require('../utils/logger');

/**
 * List all available agents
 * @param {Object} options - Command options
 */
function list(options) {
  Logger.header('📋 Claude Agents');

  if (options.installed) {
    // Show installed agents
    showInstalledAgents();
  } else {
    // Show all available agents
    showAllAgents();
  }
}

/**
 * Show all available agents with descriptions
 */
function showAllAgents() {
  Logger.info('Available agents for installation:\n');

  const agents = [
    {
      name: 'ARCHITECT',
      description: 'Design system architecture, component structure, data flow',
      color: 'blue',
      model: 'sonnet'
    },
    {
      name: 'DEVELOPER',
      description: 'Write clean, type-safe code implementing ARCHITECT\'s design',
      color: 'green',
      model: 'sonnet'
    },
    {
      name: 'DESIGNER',
      description: 'Design UI components using shadcn/ui and MCP server',
      color: 'cyan',
      model: 'sonnet'
    },
    {
      name: 'INTEGRATIONS',
      description: 'Manage external API connections (OpenAI, Anthropic, Groq)',
      color: 'yellow',
      model: 'sonnet'
    },
    {
      name: 'TESTING',
      description: 'Ensure code quality through automated testing',
      color: 'purple',
      model: 'sonnet'
    },
    {
      name: 'SECURITY-and-PRODUCTION-READINESS',
      description: 'Security review, production readiness, scalability assessment',
      color: 'cyan',
      model: 'sonnet'
    },
    {
      name: 'DEPLOYMENT',
      description: 'Manage production deployment and environment configuration',
      color: 'orange',
      model: 'sonnet'
    },
    {
      name: 'DOCUMENTATION',
      description: 'Keep documentation current and comprehensive',
      color: 'pink',
      model: 'sonnet'
    },
    {
      name: 'ORCHESTRATOR',
      description: 'Master command controller - delegates tasks to all agents',
      color: 'red',
      model: 'sonnet'
    }
  ];

  // Display as table
  console.log(chalk.gray('Agent Name').padEnd(45), chalk.gray('Description').padEnd(60), chalk.gray('Model'));
  console.log(chalk.gray('-'.repeat(120)));

  agents.forEach(agent => {
    const nameColor = getChalkColor(agent.color);
    console.log(
      nameColor(agent.name.padEnd(42)),
      chalk.white(agent.description.padEnd(58)),
      chalk.gray(agent.model)
    );
  });

  Logger.newLine();
  Logger.info(`Total: ${agents.length} agents available`);
  Logger.newLine();
  Logger.info('To install agents, run: claude-agents init');
  Logger.newLine();
}

/**
 * Show installed agents
 */
function showInstalledAgents() {
  const localAgents = getInstalledAgents('local');
  const globalAgents = getInstalledAgents('global');

  if (localAgents.length > 0) {
    Logger.info('📁 Local Agents (./.claude/agents):\n');
    localAgents.forEach(agent => {
      Logger.item(chalk.cyan(agent));
    });
    Logger.newLine();
  } else {
    Logger.warn('No local agents installed');
    Logger.newLine();
  }

  if (globalAgents.length > 0) {
    Logger.info('🌍 Global Agents (~/.claude/agents):\n');
    globalAgents.forEach(agent => {
      Logger.item(chalk.cyan(agent));
    });
    Logger.newLine();
  } else {
    Logger.warn('No global agents installed');
    Logger.newLine();
  }

  if (localAgents.length === 0 && globalAgents.length === 0) {
    Logger.info('To install agents, run: claude-agents init');
    Logger.newLine();
  }
}

/**
 * Get chalk color function from color name
 * @param {string} colorName - Color name
 * @returns {Function} - Chalk color function
 */
function getChalkColor(colorName) {
  const colors = {
    'red': chalk.red,
    'blue': chalk.blue,
    'green': chalk.green,
    'yellow': chalk.yellow,
    'purple': chalk.magenta,
    'cyan': chalk.cyan,
    'orange': chalk.hex('#FFA500'),
    'pink': chalk.hex('#FFC0CB'),
    'gray': chalk.gray
  };

  return colors[colorName] || chalk.white;
}

module.exports = { list };

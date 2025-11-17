const chalk = require('chalk');
const { getInstalledAgents } = require('../utils/fileOperations');
const { AVAILABLE_AGENTS } = require('../utils/prompts');
const { getAllPlatforms, getPlatformConfig, getDefaultPlatform, isValidPlatform } = require('../utils/platforms');
const Logger = require('../utils/logger');

/**
 * List all available agents
 * @param {Object} options - Command options
 */
async function list(options) {
  // Determine platform
  let platform;
  if (options.platform) {
    if (!isValidPlatform(options.platform)) {
      Logger.error(`Invalid platform: ${options.platform}`);
      Logger.info(`Supported platforms: ${require('../utils/platforms').getPlatformIds().join(', ')}`);
      process.exit(1);
    }
    platform = options.platform;
  } else if (options.cursor) {
    platform = 'cursor';
  } else if (options.claude) {
    platform = 'claude';
  } else {
    // If no platform specified and showing installed, check all platforms
    if (options.installed) {
      showInstalledAgentsAllPlatforms();
      return;
    }
    platform = getDefaultPlatform();
  }

  const platformConfig = getPlatformConfig(platform);
  Logger.header(`📋 ${platformConfig.displayName} Agents`);

  if (options.installed) {
    // Show installed agents for specific platform
    showInstalledAgents(platform);
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
 * Show installed agents for a specific platform
 * @param {string} platform - Platform ID
 */
function showInstalledAgents(platform) {
  const platformConfig = getPlatformConfig(platform);
  const localAgents = getInstalledAgents('local', platform);
  const globalAgents = getInstalledAgents('global', platform);

  if (localAgents.length > 0) {
    Logger.info(`📁 Local Agents (./${platformConfig.agentsPath}):\n`);
    localAgents.forEach(agent => {
      Logger.item(chalk.cyan(agent));
    });
    Logger.newLine();
  } else {
    Logger.warn('No local agents installed');
    Logger.newLine();
  }

  if (globalAgents.length > 0) {
    Logger.info(`🌍 Global Agents (~/${platformConfig.agentsPath}):\n`);
    globalAgents.forEach(agent => {
      Logger.item(chalk.cyan(agent));
    });
    Logger.newLine();
  } else {
    Logger.warn('No global agents installed');
    Logger.newLine();
  }

  if (localAgents.length === 0 && globalAgents.length === 0) {
    Logger.info(`To install agents, run: claude-agents init --${platform}`);
    Logger.newLine();
  }
}

/**
 * Show installed agents across all platforms
 */
function showInstalledAgentsAllPlatforms() {
  Logger.header('📋 Installed Agents (All Platforms)');
  Logger.newLine();

  const platforms = getAllPlatforms();
  let hasAnyAgents = false;

  for (const platform of platforms) {
    const localAgents = getInstalledAgents('local', platform.id);
    const globalAgents = getInstalledAgents('global', platform.id);

    if (localAgents.length > 0 || globalAgents.length > 0) {
      hasAnyAgents = true;
      Logger.info(`${platform.emoji} ${platform.displayName}:`);
      
      if (localAgents.length > 0) {
        Logger.item(`  Local (./${platform.agentsPath}): ${localAgents.join(', ')}`);
      }
      if (globalAgents.length > 0) {
        Logger.item(`  Global (~/${platform.agentsPath}): ${globalAgents.join(', ')}`);
      }
      Logger.newLine();
    }
  }

  if (!hasAnyAgents) {
    Logger.warn('No agents installed in any platform');
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

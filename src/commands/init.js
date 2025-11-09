const ora = require('ora');
const chalk = require('chalk');
const {
  createDirectory,
  copyAgents,
  copyProtocol,
  agentExists
} = require('../utils/fileOperations');
const {
  getInstallLocation,
  selectAgents,
  confirmOverwrite,
  AVAILABLE_AGENTS
} = require('../utils/prompts');
const Logger = require('../utils/logger');

/**
 * Initialize Claude agents
 * @param {Object} options - Command options
 */
async function init(options) {
  try {
    Logger.header('🤖 Claude Agents Setup');

    // Step 1: Determine installation location
    let location;
    if (options.global) {
      location = 'global';
    } else if (options.local) {
      location = 'local';
    } else if (options.yes) {
      location = 'local'; // Default to local for --yes flag
    } else {
      location = await getInstallLocation();
    }

    // Step 2: Select agents to install
    let selectedAgents;
    if (options.agents && options.agents.length > 0) {
      // Validate provided agents
      selectedAgents = options.agents.filter(agent =>
        AVAILABLE_AGENTS.find(a => a.value === agent)
      );

      if (selectedAgents.length === 0) {
        Logger.error('No valid agents specified.');
        Logger.info('Available agents: ' + AVAILABLE_AGENTS.map(a => a.value).join(', '));
        process.exit(1);
      }
    } else if (options.yes) {
      // Install all agents
      selectedAgents = AVAILABLE_AGENTS.map(a => a.value);
    } else {
      selectedAgents = await selectAgents();
    }

    // Step 3: Check for existing agents
    const existingAgents = selectedAgents.filter(agent => agentExists(agent, location));
    if (existingAgents.length > 0 && !options.yes) {
      Logger.warn(`The following agents already exist: ${existingAgents.join(', ')}`);
      const shouldOverwrite = await confirmOverwrite('existing agents');
      if (!shouldOverwrite) {
        Logger.info('Installation cancelled.');
        process.exit(0);
      }
    }

    // Step 4: Create directory structure
    const spinner = ora('Creating directory structure...').start();
    const targetPath = createDirectory(location);
    spinner.succeed(chalk.green('Directory structure created'));

    // Step 5: Copy agent files
    spinner.start('Installing agents...');
    await copyAgents(selectedAgents, targetPath);
    spinner.succeed(chalk.green(`${selectedAgents.length} agents installed`));

    // Step 6: Copy protocol documentation
    spinner.start('Installing protocol documentation...');
    await copyProtocol(location);
    spinner.succeed(chalk.green('Protocol documentation installed'));

    // Step 7: Show success message
    showSuccessMessage(targetPath, selectedAgents, location);

  } catch (error) {
    Logger.error('Installation failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Display success message and next steps
 * @param {string} targetPath - Installation path
 * @param {Array<string>} agents - Installed agents
 * @param {string} location - Installation location
 */
function showSuccessMessage(targetPath, agents, location) {
  Logger.newLine();
  Logger.success('Setup Complete!');
  Logger.newLine();

  Logger.info(`📁 Installation location: ${location === 'global' ? 'Global' : 'Local'}`);
  Logger.info(`📂 Path: ${targetPath}`);
  Logger.info(`📦 Agents installed: ${agents.length}`);
  Logger.newLine();

  Logger.header('Installed Agents:');
  agents.forEach(agent => {
    const agentInfo = getAgentDescription(agent);
    Logger.table(chalk.cyan(agent), agentInfo);
  });

  Logger.newLine();
  Logger.header('📚 Next Steps:');
  Logger.item('Review agents in .claude/agents/');
  Logger.item('Read AGENTS_PROTOCOL.md for usage guide');
  Logger.item('Start using agents with Claude Code');
  Logger.newLine();

  Logger.info('📖 Documentation: https://github.com/technioz/claude-agents');
  Logger.info('🐛 Issues: https://github.com/technioz/claude-agents/issues');
  Logger.newLine();

  Logger.success('Happy coding with Claude Agents! 🚀');
  Logger.newLine();
}

/**
 * Get agent description
 * @param {string} agentName - Name of the agent
 * @returns {string} - Description
 */
function getAgentDescription(agentName) {
  const descriptions = {
    'ARCHITECT': 'Design system architecture',
    'DEVELOPER': 'Write clean, type-safe code',
    'DESIGNER': 'Design UI components (shadcn/ui)',
    'INTEGRATIONS': 'Manage external APIs',
    'TESTING': 'Quality assurance and testing',
    'SECURITY-and-PRODUCTION-READINESS': 'Security review & production readiness',
    'DEPLOYMENT': 'Production deployment',
    'DOCUMENTATION': 'Keep documentation current',
    'ORCHESTRATOR': 'Master command controller'
  };

  return descriptions[agentName] || 'Custom agent';
}

module.exports = { init };

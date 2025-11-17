const inquirer = require('inquirer');
const { getAllPlatforms, getDefaultPlatform, getPlatformConfig } = require('./platforms');

const AVAILABLE_AGENTS = [
  { name: 'ARCHITECT - Design system architecture', value: 'ARCHITECT', checked: true },
  { name: 'DEVELOPER - Write clean, type-safe code', value: 'DEVELOPER', checked: true },
  { name: 'DESIGNER - Design UI components (shadcn/ui)', value: 'DESIGNER', checked: true },
  { name: 'INTEGRATIONS - Manage external APIs', value: 'INTEGRATIONS', checked: true },
  { name: 'TESTING - Quality assurance and testing', value: 'TESTING', checked: true },
  { name: 'SECURITY-and-PRODUCTION-READINESS - Security review', value: 'SECURITY-and-PRODUCTION-READINESS', checked: true },
  { name: 'DEPLOYMENT - Production deployment', value: 'DEPLOYMENT', checked: true },
  { name: 'DOCUMENTATION - Keep docs current', value: 'DOCUMENTATION', checked: true },
  { name: 'ORCHESTRATOR - Master command controller', value: 'ORCHESTRATOR', checked: true }
];

/**
 * Prompt user to select platform
 * @returns {Promise<string>} - Platform ID
 */
async function getPlatform() {
  const platforms = getAllPlatforms();
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Which platform do you want to use?',
      choices: platforms.map(p => ({
        name: `${p.emoji} ${p.displayName} - ${p.name} integration`,
        value: p.id
      })),
      default: getDefaultPlatform()
    }
  ]);
  return platform;
}

/**
 * Prompt user for installation location
 * @param {string} platform - Platform ID (default: 'claude')
 * @returns {Promise<string>} - 'global' or 'local'
 */
async function getInstallLocation(platform = getDefaultPlatform()) {
  const platformConfig = getPlatformConfig(platform);
  const { location } = await inquirer.prompt([
    {
      type: 'list',
      name: 'location',
      message: 'Where do you want to install the agents?',
      choices: [
        {
          name: `🌍 Global (~/${platformConfig.agentsPath}) - Available across all projects`,
          value: 'global'
        },
        {
          name: `📁 Local (./${platformConfig.agentsPath}) - Project-specific agents`,
          value: 'local'
        }
      ],
      default: 'local'
    }
  ]);
  return location;
}

/**
 * Prompt user to select agents to install
 * @returns {Promise<Array<string>>} - List of selected agent names
 */
async function selectAgents() {
  const { agents } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'agents',
      message: 'Select agents to install:',
      choices: AVAILABLE_AGENTS,
      pageSize: 10,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'You must select at least one agent.';
        }
        return true;
      }
    }
  ]);
  return agents;
}

/**
 * Prompt user for custom agent metadata
 * @param {string} agentName - Name of the custom agent
 * @returns {Promise<Object>} - Agent metadata
 */
async function getCustomAgentMetadata(agentName) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Enter agent description:',
      default: `Custom agent for specialized tasks`,
      validate: (input) => {
        if (input.length > 500) {
          return 'Description must be less than 500 characters';
        }
        if (input.length < 10) {
          return 'Description must be at least 10 characters';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select AI model:',
      choices: ['sonnet', 'opus', 'haiku'],
      default: 'sonnet'
    },
    {
      type: 'list',
      name: 'color',
      message: 'Select agent color:',
      choices: ['red', 'blue', 'green', 'yellow', 'purple', 'cyan', 'orange', 'pink', 'gray'],
      default: 'gray'
    }
  ]);

  return answers;
}

/**
 * Prompt user to confirm overwrite
 * @param {string} agentName - Name of the agent
 * @returns {Promise<boolean>} - True if user confirms
 */
async function confirmOverwrite(agentName) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Agent ${agentName} already exists. Do you want to overwrite it?`,
      default: false
    }
  ]);
  return confirm;
}

/**
 * Prompt user to select agents to update
 * @param {Array<string>} installedAgents - List of installed agents
 * @returns {Promise<Array<string>>} - List of agents to update
 */
async function selectAgentsToUpdate(installedAgents) {
  const choices = installedAgents.map(agent => ({
    name: agent,
    value: agent,
    checked: true
  }));

  const { agents } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'agents',
      message: 'Select agents to update:',
      choices: choices,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'You must select at least one agent.';
        }
        return true;
      }
    }
  ]);

  return agents;
}

/**
 * Prompt user to confirm action
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} - True if confirmed
 */
async function confirm(message) {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: message,
      default: true
    }
  ]);
  return confirmed;
}

module.exports = {
  AVAILABLE_AGENTS,
  getPlatform,
  getInstallLocation,
  selectAgents,
  getCustomAgentMetadata,
  confirmOverwrite,
  selectAgentsToUpdate,
  confirm
};

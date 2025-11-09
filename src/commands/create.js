const ora = require('ora');
const chalk = require('chalk');
const {
  createCustomAgent,
  agentExists,
  createDirectory
} = require('../utils/fileOperations');
const {
  getCustomAgentMetadata,
  confirmOverwrite
} = require('../utils/prompts');
const Logger = require('../utils/logger');

/**
 * Create a new custom agent from template
 * @param {string} agentName - Name of the custom agent
 * @param {Object} options - Command options
 */
async function create(agentName, options) {
  try {
    Logger.header('🎨 Create Custom Agent');

    // Validate agent name
    if (!agentName || agentName.trim() === '') {
      Logger.error('Agent name is required');
      Logger.info('Usage: claude-agents create <agent-name>');
      process.exit(1);
    }

    // Convert to uppercase and replace spaces with hyphens
    const normalizedName = agentName.toUpperCase().replace(/\s+/g, '-');
    Logger.info(`Creating agent: ${normalizedName}`);
    Logger.newLine();

    // Step 1: Determine location
    let location;
    if (options.global) {
      location = 'global';
    } else if (options.local) {
      location = 'local';
    } else {
      // Ask user
      const { useGlobal } = await require('inquirer').prompt([
        {
          type: 'list',
          name: 'useGlobal',
          message: 'Where do you want to create the agent?',
          choices: [
            { name: 'Local (./.claude/agents)', value: false },
            { name: 'Global (~/.claude/agents)', value: true }
          ]
        }
      ]);
      location = useGlobal ? 'global' : 'local';
    }

    // Step 2: Check if agent already exists
    if (agentExists(normalizedName, location)) {
      Logger.warn(`Agent ${normalizedName} already exists`);
      const shouldOverwrite = await confirmOverwrite(normalizedName);

      if (!shouldOverwrite) {
        Logger.info('Operation cancelled');
        return;
      }
    }

    // Step 3: Get agent metadata
    Logger.info('Configure your custom agent:');
    Logger.newLine();
    const metadata = await getCustomAgentMetadata(normalizedName);

    // Step 4: Create directory if needed
    const targetPath = createDirectory(location);

    // Step 5: Create agent file
    const spinner = ora('Creating custom agent...').start();

    await createCustomAgent(normalizedName, location, metadata);

    spinner.succeed(chalk.green('Custom agent created successfully!'));

    // Step 6: Show success message
    Logger.newLine();
    Logger.success('Custom Agent Created!');
    Logger.newLine();

    Logger.info(`📁 Agent name: ${chalk.cyan(normalizedName)}`);
    Logger.info(`📂 Location: ${targetPath}/${normalizedName}.md`);
    Logger.info(`📝 Description: ${metadata.description}`);
    Logger.info(`🤖 Model: ${metadata.model}`);
    Logger.info(`🎨 Color: ${metadata.color}`);
    Logger.newLine();

    Logger.header('📚 Next Steps:');
    Logger.item(`Edit ${normalizedName}.md to customize agent behavior`);
    Logger.item('Define Purpose, Duty, Instructions, and Limits');
    Logger.item('Add specific capabilities and knowledge requirements');
    Logger.item('Define integration with other agents');
    Logger.item('Test your agent with Claude Code');
    Logger.newLine();

    Logger.info(`📝 Edit: ${targetPath}/${normalizedName}.md`);
    Logger.newLine();

  } catch (error) {
    Logger.error('Failed to create custom agent');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

module.exports = { create };

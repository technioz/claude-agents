const ora = require('ora');
const chalk = require('chalk');
const {
  createCustomAgent,
  agentExists,
  createDirectory
} = require('../utils/fileOperations');
const {
  getPlatform,
  getInstallLocation,
  getCustomAgentMetadata,
  confirmOverwrite
} = require('../utils/prompts');
const { getPlatformConfig, getDefaultPlatform, isValidPlatform } = require('../utils/platforms');
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

    // Validate agent name to prevent path traversal
    if (agentName.includes('/') || agentName.includes('\\') || agentName.includes('..')) {
      Logger.error('Agent name cannot contain path separators or relative paths');
      Logger.info('Use only letters, numbers, hyphens, and underscores');
      process.exit(1);
    }

    // Convert to uppercase and replace spaces with hyphens
    const normalizedName = agentName.toUpperCase().replace(/\s+/g, '-');
    Logger.info(`Creating agent: ${normalizedName}`);
    Logger.newLine();

    // Step 0: Determine platform
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
      platform = await getPlatform();
    }

    const platformConfig = getPlatformConfig(platform);

    // Step 1: Determine location
    let location;
    if (options.global) {
      location = 'global';
    } else if (options.local) {
      location = 'local';
    } else {
      location = await getInstallLocation(platform);
    }

    // Step 2: Check if agent already exists
    if (agentExists(normalizedName, location, platform)) {
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
    const targetPath = createDirectory(location, platform);

    // Step 5: Create agent file
    const spinner = ora('Creating custom agent...').start();

    await createCustomAgent(normalizedName, location, metadata, platform);

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
    Logger.item(`Test your agent with ${platformConfig.displayName}`);
    Logger.newLine();

    Logger.info(`📝 Edit: ${targetPath}/${normalizedName}.md`);
    Logger.newLine();

  } catch (error) {
    Logger.error('Failed to create custom agent');
    // Only show detailed error in debug mode
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.error(chalk.gray('Debug:', error.message));
    }
    process.exit(1);
  }
}

module.exports = { create };

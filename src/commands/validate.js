const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const {
  getTargetPath,
  validateAgent,
  getInstalledAgents
} = require('../utils/fileOperations');
const { getPlatformConfig, getDefaultPlatform, isValidPlatform } = require('../utils/platforms');
const Logger = require('../utils/logger');

/**
 * Validate agent configuration files
 * @param {Object} options - Command options
 */
async function validate(options) {
  try {
    // Step 0: Determine platform (if not using custom path)
    let platform = getDefaultPlatform();
    if (!options.path) {
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
      }
    }

    const platformConfig = getPlatformConfig(platform);
    Logger.header(`✅ Validate ${platformConfig.displayName} Agent Configuration`);

    // Step 1: Determine path to validate
    let targetPath;
    if (options.path) {
      targetPath = path.resolve(options.path);
    } else if (options.global) {
      targetPath = getTargetPath('global', platform);
    } else {
      targetPath = getTargetPath('local', platform);
    }

    // Step 2: Check if directory exists
    if (!fs.existsSync(targetPath)) {
      Logger.error(`Directory not found: ${targetPath}`);
      if (!options.path) {
        Logger.info(`Run "claude-agents init --${platform}" to install agents.`);
      }
      return;
    }

    Logger.info(`Validating agents in: ${targetPath}`);
    Logger.newLine();

    // Step 3: Get all agent files
    const agentFiles = fs.readdirSync(targetPath)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        name: file.replace('.md', ''),
        path: path.join(targetPath, file)
      }));

    if (agentFiles.length === 0) {
      Logger.warn('No agent files found');
      return;
    }

    // Step 4: Validate each agent
    let validCount = 0;
    let invalidCount = 0;
    const results = [];

    for (const agent of agentFiles) {
      const result = await validateAgent(agent.path);
      results.push({ agent: agent.name, ...result });

      if (result.valid) {
        validCount++;
      } else {
        invalidCount++;
      }
    }

    // Step 5: Display results
    Logger.header('Validation Results:');
    Logger.newLine();

    for (const result of results) {
      if (result.valid) {
        Logger.success(`${result.agent} - Valid`);
      } else {
        Logger.error(`${result.agent} - Invalid`);
        result.errors.forEach(error => {
          console.log(chalk.red('    ✗'), chalk.gray(error));
        });
      }
    }

    Logger.newLine();

    // Step 6: Show summary
    Logger.header('Summary:');
    Logger.info(`Total agents: ${agentFiles.length}`);
    Logger.success(`Valid: ${validCount}`);

    if (invalidCount > 0) {
      Logger.error(`Invalid: ${invalidCount}`);
      Logger.newLine();
      Logger.warn('Please fix the issues listed above');
      process.exit(1);
    } else {
      Logger.newLine();
      Logger.success('All agents are valid! ✨');
    }

    Logger.newLine();

  } catch (error) {
    Logger.error('Validation failed');
    // Only show detailed error in debug mode
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.error(chalk.gray('Debug:', error.message));
    }
    process.exit(1);
  }
}

module.exports = { validate };

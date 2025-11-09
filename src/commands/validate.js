const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const {
  getTargetPath,
  validateAgent,
  getInstalledAgents
} = require('../utils/fileOperations');
const Logger = require('../utils/logger');

/**
 * Validate agent configuration files
 * @param {Object} options - Command options
 */
async function validate(options) {
  try {
    Logger.header('✅ Validate Agent Configuration');

    // Step 1: Determine path to validate
    let targetPath;
    if (options.path) {
      targetPath = path.resolve(options.path);
    } else if (options.global) {
      targetPath = getTargetPath('global');
    } else {
      targetPath = getTargetPath('local');
    }

    // Step 2: Check if directory exists
    if (!fs.existsSync(targetPath)) {
      Logger.error(`Directory not found: ${targetPath}`);
      Logger.info('Run "claude-agents init" to install agents.');
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
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

module.exports = { validate };

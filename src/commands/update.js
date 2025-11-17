const ora = require('ora');
const chalk = require('chalk');
const {
  getInstalledAgents,
  updateAgent,
  getTargetPath
} = require('../utils/fileOperations');
const {
  getPlatform,
  getInstallLocation,
  selectAgentsToUpdate,
  confirm
} = require('../utils/prompts');
const { getPlatformConfig, getDefaultPlatform, isValidPlatform } = require('../utils/platforms');
const Logger = require('../utils/logger');

/**
 * Update existing agents to latest version
 * @param {Object} options - Command options
 */
async function update(options) {
  try {
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
    Logger.header(`🔄 Update ${platformConfig.displayName} Agents`);

    // Step 1: Determine location
    let location;
    if (options.global) {
      location = 'global';
    } else if (options.local) {
      location = 'local';
    } else {
      location = await getInstallLocation(platform);
    }

    // Step 2: Get installed agents
    const installedAgents = getInstalledAgents(location, platform);

    if (installedAgents.length === 0) {
      const targetPath = getTargetPath(location, platform);
      Logger.warn(`No agents found at ${targetPath}`);
      Logger.info(`Run "claude-agents init --${platform}" to install agents.`);
      return;
    }

    Logger.info(`Found ${installedAgents.length} installed agents`);
    Logger.newLine();

    // Step 3: Select agents to update
    let agentsToUpdate;
    if (options.agents && options.agents.length > 0) {
      // Filter to only installed agents
      agentsToUpdate = options.agents.filter(agent =>
        installedAgents.includes(agent)
      );

      if (agentsToUpdate.length === 0) {
        Logger.error('None of the specified agents are installed.');
        Logger.info('Installed agents: ' + installedAgents.join(', '));
        process.exit(1);
      }
    } else {
      agentsToUpdate = await selectAgentsToUpdate(installedAgents);
    }

    // Step 4: Confirm update
    Logger.info(`Selected ${agentsToUpdate.length} agent(s) for update`);
    const shouldProceed = await confirm(`Update ${agentsToUpdate.length} agent(s)?`);

    if (!shouldProceed) {
      Logger.info('Update cancelled.');
      return;
    }

    // Step 5: Update agents
    const spinner = ora('Updating agents...').start();
    let successCount = 0;
    let failCount = 0;

    for (const agent of agentsToUpdate) {
      try {
        await updateAgent(agent, location, platform);
        successCount++;
      } catch (error) {
        failCount++;
        spinner.warn(chalk.yellow(`Failed to update ${agent}: ${error.message}`));
      }
    }

    if (failCount === 0) {
      spinner.succeed(chalk.green(`Successfully updated ${successCount} agent(s)`));
    } else {
      spinner.warn(chalk.yellow(`Updated ${successCount} agent(s), ${failCount} failed`));
    }

    // Step 6: Show summary
    Logger.newLine();
    Logger.success('Update Complete!');
    Logger.newLine();

    Logger.header('Updated Agents:');
    agentsToUpdate.forEach(agent => {
      Logger.item(chalk.cyan(agent));
    });

    Logger.newLine();
    Logger.info('All agents are now up to date! 🎉');
    Logger.newLine();

  } catch (error) {
    Logger.error('Update failed');
    // Only show detailed error in debug mode
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.error(chalk.gray('Debug:', error.message));
    }
    process.exit(1);
  }
}

module.exports = { update };

const ora = require('ora');
const chalk = require('chalk');
const {
  getInstalledAgents,
  updateAgent,
  getTargetPath
} = require('../utils/fileOperations');
const {
  selectAgentsToUpdate,
  confirm
} = require('../utils/prompts');
const Logger = require('../utils/logger');

/**
 * Update existing agents to latest version
 * @param {Object} options - Command options
 */
async function update(options) {
  try {
    Logger.header('🔄 Update Claude Agents');

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
          message: 'Which agents do you want to update?',
          choices: [
            { name: 'Local (./.claude/agents)', value: false },
            { name: 'Global (~/.claude/agents)', value: true }
          ]
        }
      ]);
      location = useGlobal ? 'global' : 'local';
    }

    // Step 2: Get installed agents
    const installedAgents = getInstalledAgents(location);

    if (installedAgents.length === 0) {
      const targetPath = getTargetPath(location);
      Logger.warn(`No agents found at ${targetPath}`);
      Logger.info('Run "claude-agents init" to install agents.');
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
        await updateAgent(agent, location);
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

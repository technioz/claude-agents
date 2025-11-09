const chalk = require('chalk');

/**
 * Logger utility for consistent CLI output
 */
class Logger {
  /**
   * Log success message
   * @param {string} message - Message to log
   */
  static success(message) {
    console.log(chalk.green('✓'), chalk.white(message));
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   */
  static error(message) {
    console.log(chalk.red('✗'), chalk.white(message));
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  static warn(message) {
    console.log(chalk.yellow('⚠'), chalk.white(message));
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   */
  static info(message) {
    console.log(chalk.blue('ℹ'), chalk.white(message));
  }

  /**
   * Log section header
   * @param {string} message - Header text
   */
  static header(message) {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  }

  /**
   * Log list item
   * @param {string} message - Item text
   */
  static item(message) {
    console.log(chalk.gray('  •'), chalk.white(message));
  }

  /**
   * Log blank line
   */
  static newLine() {
    console.log('');
  }

  /**
   * Log table row
   * @param {string} col1 - First column
   * @param {string} col2 - Second column
   * @param {string} col3 - Third column (optional)
   */
  static table(col1, col2, col3 = '') {
    const pad = (str, length) => str.padEnd(length, ' ');
    console.log(
      chalk.gray(pad(col1, 30)),
      chalk.white(pad(col2, 50)),
      chalk.gray(col3)
    );
  }
}

module.exports = Logger;

/**
 * Platform Registry
 * Centralized configuration for all supported platforms
 * Adding a new platform requires only adding an entry here
 */

const PLATFORMS = {
  claude: {
    id: 'claude',
    name: 'Claude Code',
    directory: '.claude',
    agentsPath: '.claude/agents',
    protocolPath: '.claude/AGENTS_PROTOCOL.md',
    displayName: 'Claude Code',
    emoji: '🤖'
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    directory: '.cursor',
    agentsPath: '.cursor/agents',
    protocolPath: '.cursor/AGENTS_PROTOCOL.md',
    displayName: 'Cursor',
    emoji: '🖱️'
  }
  // Future platforms can be added here:
  // codex: {
  //   id: 'codex',
  //   name: 'Codex',
  //   directory: '.codex',
  //   agentsPath: '.codex/agents',
  //   protocolPath: '.codex/AGENTS_PROTOCOL.md',
  //   displayName: 'Codex',
  //   emoji: '⚡'
  // }
};

/**
 * Get platform configuration by ID
 * @param {string} platformId - Platform identifier
 * @returns {Object} - Platform configuration
 * @throws {Error} - If platform is not found
 */
function getPlatformConfig(platformId) {
  const platform = PLATFORMS[platformId];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformId}. Supported platforms: ${Object.keys(PLATFORMS).join(', ')}`);
  }
  return platform;
}

/**
 * Get all available platforms
 * @returns {Array<Object>} - Array of platform configurations
 */
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

/**
 * Get platform IDs
 * @returns {Array<string>} - Array of platform IDs
 */
function getPlatformIds() {
  return Object.keys(PLATFORMS);
}

/**
 * Check if platform ID is valid
 * @param {string} platformId - Platform identifier
 * @returns {boolean} - True if platform is valid
 */
function isValidPlatform(platformId) {
  return platformId in PLATFORMS;
}

/**
 * Get default platform
 * @returns {string} - Default platform ID
 */
function getDefaultPlatform() {
  return 'claude';
}

module.exports = {
  PLATFORMS,
  getPlatformConfig,
  getAllPlatforms,
  getPlatformIds,
  isValidPlatform,
  getDefaultPlatform
};


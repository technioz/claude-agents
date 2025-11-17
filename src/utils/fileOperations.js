const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { getPlatformConfig, getDefaultPlatform } = require('./platforms');

/**
 * Sanitize agent name to prevent path traversal and special characters
 * @param {string} name - Agent name to sanitize
 * @returns {string} - Sanitized name
 * @throws {Error} - If name contains invalid characters
 */
function sanitizeAgentName(name) {
  // Check for path traversal attempts
  if (name.includes('/') || name.includes('\\') || name.includes('..')) {
    throw new Error('Agent name cannot contain path separators');
  }

  // Only allow alphanumeric, hyphens, and underscores
  if (!/^[A-Z0-9_-]+$/i.test(name)) {
    throw new Error('Agent name can only contain letters, numbers, hyphens, and underscores');
  }

  return name;
}

/**
 * Get the target directory path based on installation location and platform
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 * @returns {string} - Full path to platform agents directory
 */
function getTargetPath(location, platform = getDefaultPlatform()) {
  const platformConfig = getPlatformConfig(platform);
  const agentsPathParts = platformConfig.agentsPath.split('/');
  
  if (location === 'global') {
    return path.join(os.homedir(), ...agentsPathParts);
  } else {
    return path.join(process.cwd(), ...agentsPathParts);
  }
}

/**
 * Create platform agents directory structure
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 * @returns {string} - Path to created directory
 */
function createDirectory(location, platform = getDefaultPlatform()) {
  const targetPath = getTargetPath(location, platform);

  // Create directory if it doesn't exist
  fs.ensureDirSync(targetPath);

  return targetPath;
}

/**
 * Copy agent files to target directory
 * @param {Array<string>} agents - List of agent names to copy
 * @param {string} targetPath - Destination directory
 */
async function copyAgents(agents, targetPath) {
  const templatePath = path.join(__dirname, '../../templates/agents');

  for (const agent of agents) {
    // Sanitize agent name
    const sanitizedAgent = sanitizeAgentName(agent);

    const sourceFile = path.join(templatePath, `${sanitizedAgent}.md`);
    const targetFile = path.join(targetPath, `${sanitizedAgent}.md`);

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`Agent template not found: ${sanitizedAgent}.md`);
    }

    // Copy file
    await fs.copy(sourceFile, targetFile, { overwrite: true });
  }
}

/**
 * Copy AGENTS_PROTOCOL.md to platform directory
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 */
async function copyProtocol(location, platform = getDefaultPlatform()) {
  const platformConfig = getPlatformConfig(platform);
  const directoryParts = platformConfig.directory.split('/');
  
  const targetBase = location === 'global'
    ? path.join(os.homedir(), ...directoryParts)
    : path.join(process.cwd(), ...directoryParts);

  const sourcePath = path.join(__dirname, '../../templates/AGENTS_PROTOCOL.md');
  const targetPath = path.join(targetBase, 'AGENTS_PROTOCOL.md');

  await fs.copy(sourcePath, targetPath, { overwrite: true });
}

/**
 * Get list of installed agents
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 * @returns {Array<string>} - List of installed agent names
 */
function getInstalledAgents(location, platform = getDefaultPlatform()) {
  const targetPath = getTargetPath(location, platform);

  if (!fs.existsSync(targetPath)) {
    return [];
  }

  const files = fs.readdirSync(targetPath);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''));
}

/**
 * Check if agent exists in target directory
 * @param {string} agentName - Name of the agent
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 * @returns {boolean} - True if agent exists
 */
function agentExists(agentName, location, platform = getDefaultPlatform()) {
  const targetPath = getTargetPath(location, platform);
  const agentFile = path.join(targetPath, `${agentName}.md`);
  return fs.existsSync(agentFile);
}

/**
 * Update existing agent file
 * @param {string} agentName - Name of the agent to update
 * @param {string} location - 'global' or 'local'
 * @param {string} platform - Platform ID (default: 'claude')
 */
async function updateAgent(agentName, location, platform = getDefaultPlatform()) {
  // Sanitize agent name
  const sanitizedName = sanitizeAgentName(agentName);

  const templatePath = path.join(__dirname, '../../templates/agents', `${sanitizedName}.md`);
  const targetPath = path.join(getTargetPath(location, platform), `${sanitizedName}.md`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Agent template not found: ${sanitizedName}.md`);
  }

  await fs.copy(templatePath, targetPath, { overwrite: true });
}

/**
 * Create custom agent from template
 * @param {string} agentName - Name of the custom agent
 * @param {string} location - 'global' or 'local'
 * @param {Object} metadata - Agent metadata
 * @param {string} platform - Platform ID (default: 'claude')
 */
async function createCustomAgent(agentName, location, metadata, platform = getDefaultPlatform()) {
  // Sanitize agent name
  const sanitizedName = sanitizeAgentName(agentName);

  const templatePath = path.join(__dirname, '../../templates/custom-agent-template.md');
  const targetPath = path.join(getTargetPath(location, platform), `${sanitizedName}.md`);

  // Read template
  let template = await fs.readFile(templatePath, 'utf8');

  // Replace placeholders
  template = template.replace(/\{AGENT_NAME\}/g, sanitizedName);
  template = template.replace(/\{DESCRIPTION\}/g, metadata.description || 'Custom agent');
  template = template.replace(/\{MODEL\}/g, metadata.model || 'sonnet');
  template = template.replace(/\{COLOR\}/g, metadata.color || 'gray');

  // Write to target
  await fs.writeFile(targetPath, template, 'utf8');
}

/**
 * Validate agent file structure
 * @param {string} agentPath - Path to agent markdown file
 * @returns {Object} - Validation result
 */
async function validateAgent(agentPath) {
  if (!fs.existsSync(agentPath)) {
    return { valid: false, errors: ['File does not exist'] };
  }

  const content = await fs.readFile(agentPath, 'utf8');
  const errors = [];

  // Check for frontmatter
  if (!content.startsWith('---') && !content.includes('name:')) {
    errors.push('Missing agent metadata (name, description, model, color)');
  }

  // Check for required sections
  const requiredSections = ['Purpose', 'Duty', 'Instructions'];
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`) && !content.includes(`### ${section}`)) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  sanitizeAgentName,
  getTargetPath,
  createDirectory,
  copyAgents,
  copyProtocol,
  getInstalledAgents,
  agentExists,
  updateAgent,
  createCustomAgent,
  validateAgent
};

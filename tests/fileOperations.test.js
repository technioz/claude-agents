/**
 * File Operations Tests for @technioz/claude-agents
 *
 * Tests all file operation utilities including:
 * - Directory creation
 * - Path resolution
 * - Agent copying
 * - Validation
 * - Custom agent creation
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const {
  sanitizeAgentName,
  getTargetPath,
  createDirectory,
  copyAgents,
  getInstalledAgents,
  agentExists,
  updateAgent,
  createCustomAgent,
  validateAgent
} = require('../src/utils/fileOperations');

// Mock fs-extra for safer testing
jest.mock('fs-extra');

describe('File Operations Tests', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getTargetPath', () => {

    test('should return global path for global location', () => {
      const result = getTargetPath('global');
      const expected = path.join(os.homedir(), '.claude', 'agents');
      expect(result).toBe(expected);
    });

    test('should return local path for local location', () => {
      const result = getTargetPath('local');
      const expected = path.join(process.cwd(), '.claude', 'agents');
      expect(result).toBe(expected);
    });

    test('should handle local as default when not global', () => {
      const result = getTargetPath('anything-else');
      const expected = path.join(process.cwd(), '.claude', 'agents');
      expect(result).toBe(expected);
    });

    test('should return different paths for global vs local', () => {
      const globalPath = getTargetPath('global');
      const localPath = getTargetPath('local');
      expect(globalPath).not.toBe(localPath);
    });

    test('global path should include home directory', () => {
      const result = getTargetPath('global');
      expect(result).toContain(os.homedir());
    });

    test('local path should include current working directory', () => {
      const result = getTargetPath('local');
      expect(result).toContain(process.cwd());
    });
  });

  describe('createDirectory', () => {

    test('should create directory for global location', () => {
      fs.ensureDirSync.mockImplementation(() => {});

      const result = createDirectory('global');
      const expected = path.join(os.homedir(), '.claude', 'agents');

      expect(fs.ensureDirSync).toHaveBeenCalledWith(expected);
      expect(result).toBe(expected);
    });

    test('should create directory for local location', () => {
      fs.ensureDirSync.mockImplementation(() => {});

      const result = createDirectory('local');
      const expected = path.join(process.cwd(), '.claude', 'agents');

      expect(fs.ensureDirSync).toHaveBeenCalledWith(expected);
      expect(result).toBe(expected);
    });

    test('should call ensureDirSync exactly once', () => {
      fs.ensureDirSync.mockImplementation(() => {});

      createDirectory('global');

      expect(fs.ensureDirSync).toHaveBeenCalledTimes(1);
    });

    test('should return the created path', () => {
      fs.ensureDirSync.mockImplementation(() => {});

      const result = createDirectory('local');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('copyAgents', () => {

    test('should sanitize agent names before copying', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.copy.mockResolvedValue(undefined);

      const agents = ['ARCHITECT'];
      const targetPath = '/test/path';

      await copyAgents(agents, targetPath);

      expect(fs.copy).toHaveBeenCalled();
    });

    test('should throw error for invalid agent name', async () => {
      await expect(async () => {
        await copyAgents(['../malicious'], '/test/path');
      }).rejects.toThrow('Agent name cannot contain path separators');
    });

    test('should throw error when source file does not exist', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(async () => {
        await copyAgents(['NONEXISTENT'], '/test/path');
      }).rejects.toThrow('Agent template not found');
    });

    test('should copy multiple agents', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.copy.mockResolvedValue(undefined);

      const agents = ['ARCHITECT', 'DEVELOPER', 'DESIGNER'];
      const targetPath = '/test/path';

      await copyAgents(agents, targetPath);

      expect(fs.copy).toHaveBeenCalledTimes(3);
    });

    test('should use overwrite option when copying', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.copy.mockResolvedValue(undefined);

      await copyAgents(['ARCHITECT'], '/test/path');

      expect(fs.copy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        { overwrite: true }
      );
    });

    test('should handle empty agent array', async () => {
      await copyAgents([], '/test/path');

      expect(fs.copy).not.toHaveBeenCalled();
    });
  });

  describe('getInstalledAgents', () => {

    test('should return empty array when directory does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const result = getInstalledAgents('local');

      expect(result).toEqual([]);
    });

    test('should return list of installed agents', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['ARCHITECT.md', 'DEVELOPER.md', 'README.txt']);

      const result = getInstalledAgents('local');

      expect(result).toEqual(['ARCHITECT', 'DEVELOPER']);
    });

    test('should filter out non-markdown files', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([
        'ARCHITECT.md',
        'config.json',
        'README.txt',
        'DEVELOPER.md'
      ]);

      const result = getInstalledAgents('local');

      expect(result).toEqual(['ARCHITECT', 'DEVELOPER']);
      expect(result).not.toContain('config');
      expect(result).not.toContain('README');
    });

    test('should remove .md extension from filenames', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['TESTING.md']);

      const result = getInstalledAgents('local');

      expect(result).toEqual(['TESTING']);
      expect(result[0]).not.toContain('.md');
    });

    test('should handle empty directory', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue([]);

      const result = getInstalledAgents('local');

      expect(result).toEqual([]);
    });
  });

  describe('agentExists', () => {

    test('should return true when agent exists', () => {
      fs.existsSync.mockReturnValue(true);

      const result = agentExists('ARCHITECT', 'local');

      expect(result).toBe(true);
    });

    test('should return false when agent does not exist', () => {
      fs.existsSync.mockReturnValue(false);

      const result = agentExists('NONEXISTENT', 'local');

      expect(result).toBe(false);
    });

    test('should check correct path for global location', () => {
      fs.existsSync.mockReturnValue(false);

      agentExists('ARCHITECT', 'global');

      const expectedPath = path.join(os.homedir(), '.claude', 'agents', 'ARCHITECT.md');
      expect(fs.existsSync).toHaveBeenCalledWith(expectedPath);
    });

    test('should check correct path for local location', () => {
      fs.existsSync.mockReturnValue(false);

      agentExists('DEVELOPER', 'local');

      const expectedPath = path.join(process.cwd(), '.claude', 'agents', 'DEVELOPER.md');
      expect(fs.existsSync).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('updateAgent', () => {

    test('should sanitize agent name before updating', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.copy.mockResolvedValue(undefined);

      await updateAgent('ARCHITECT', 'local');

      expect(fs.copy).toHaveBeenCalled();
    });

    test('should reject invalid agent name', async () => {
      await expect(async () => {
        await updateAgent('../malicious', 'local');
      }).rejects.toThrow('Agent name cannot contain path separators');
    });

    test('should throw error when template does not exist', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(async () => {
        await updateAgent('NONEXISTENT', 'local');
      }).rejects.toThrow('Agent template not found');
    });

    test('should use overwrite option', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.copy.mockResolvedValue(undefined);

      await updateAgent('ARCHITECT', 'local');

      expect(fs.copy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        { overwrite: true }
      );
    });
  });

  describe('createCustomAgent', () => {

    test('should sanitize agent name before creating', async () => {
      fs.readFile.mockResolvedValue('Template content with {AGENT_NAME}');
      fs.writeFile.mockResolvedValue(undefined);

      const metadata = {
        description: 'Test agent',
        model: 'sonnet',
        color: 'blue'
      };

      await createCustomAgent('CustomAgent', 'local', metadata);

      expect(fs.writeFile).toHaveBeenCalled();
    });

    test('should reject invalid agent name', async () => {
      const metadata = { description: 'Test' };

      await expect(async () => {
        await createCustomAgent('../malicious', 'local', metadata);
      }).rejects.toThrow('Agent name cannot contain path separators');
    });

    test('should replace placeholders in template', async () => {
      const template = 'Agent: {AGENT_NAME}, Desc: {DESCRIPTION}, Model: {MODEL}, Color: {COLOR}';
      fs.readFile.mockResolvedValue(template);
      fs.writeFile.mockResolvedValue(undefined);

      const metadata = {
        description: 'Test Agent',
        model: 'opus',
        color: 'green'
      };

      await createCustomAgent('TestAgent', 'local', metadata);

      const writeCall = fs.writeFile.mock.calls[0];
      const writtenContent = writeCall[1];

      expect(writtenContent).toContain('TestAgent');
      expect(writtenContent).toContain('Test Agent');
      expect(writtenContent).toContain('opus');
      expect(writtenContent).toContain('green');
      expect(writtenContent).not.toContain('{AGENT_NAME}');
      expect(writtenContent).not.toContain('{DESCRIPTION}');
    });

    test('should use default values when metadata is missing', async () => {
      const template = 'Desc: {DESCRIPTION}, Model: {MODEL}, Color: {COLOR}';
      fs.readFile.mockResolvedValue(template);
      fs.writeFile.mockResolvedValue(undefined);

      await createCustomAgent('TestAgent', 'local', {});

      const writeCall = fs.writeFile.mock.calls[0];
      const writtenContent = writeCall[1];

      expect(writtenContent).toContain('Custom agent');
      expect(writtenContent).toContain('sonnet');
      expect(writtenContent).toContain('gray');
    });

    test('should write to correct location for global', async () => {
      fs.readFile.mockResolvedValue('Content');
      fs.writeFile.mockResolvedValue(undefined);

      await createCustomAgent('TestAgent', 'global', {});

      const writeCall = fs.writeFile.mock.calls[0];
      const targetPath = writeCall[0];

      expect(targetPath).toContain(os.homedir());
      expect(targetPath).toContain('.claude');
      expect(targetPath).toContain('TestAgent.md');
    });
  });

  describe('validateAgent', () => {

    test('should return invalid when file does not exist', async () => {
      fs.existsSync.mockReturnValue(false);

      const result = await validateAgent('/path/to/nonexistent.md');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File does not exist');
    });

    test('should return invalid when missing metadata', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('# Agent\n\n## Purpose\nTest\n\n## Duty\nTest\n\n## Instructions\nTest');

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing agent metadata (name, description, model, color)');
    });

    test('should return invalid when missing Purpose section', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('---\nname: Test\n---\n\n## Duty\nTest\n\n## Instructions\nTest');

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Purpose'))).toBe(true);
    });

    test('should return invalid when missing Duty section', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('---\nname: Test\n---\n\n## Purpose\nTest\n\n## Instructions\nTest');

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duty'))).toBe(true);
    });

    test('should return invalid when missing Instructions section', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('---\nname: Test\n---\n\n## Purpose\nTest\n\n## Duty\nTest');

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Instructions'))).toBe(true);
    });

    test('should return valid for properly formatted agent', async () => {
      fs.existsSync.mockReturnValue(true);
      const validContent = `---
name: TestAgent
description: Test agent
model: sonnet
color: blue
---

## Purpose
Test purpose

## Duty
Test duty

## Instructions
Test instructions`;

      fs.readFile.mockResolvedValue(validContent);

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should accept ### headings for sections', async () => {
      fs.existsSync.mockReturnValue(true);
      const validContent = `---
name: TestAgent
---

### Purpose
Test

### Duty
Test

### Instructions
Test`;

      fs.readFile.mockResolvedValue(validContent);

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(true);
    });

    test('should return multiple errors when multiple sections missing', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockResolvedValue('Some content without proper structure');

      const result = await validateAgent('/path/to/agent.md');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

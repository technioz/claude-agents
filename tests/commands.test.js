/**
 * Commands Tests for @technioz/claude-agents
 *
 * Tests for init and create commands to ensure proper:
 * - Input validation
 * - Error handling
 * - Security measures
 */

const { init } = require('../src/commands/init');
const { create } = require('../src/commands/create');
const {
  createDirectory,
  copyAgents,
  copyProtocol,
  agentExists,
  createCustomAgent
} = require('../src/utils/fileOperations');

// Mock dependencies
jest.mock('../src/utils/fileOperations');
jest.mock('../src/utils/logger');
jest.mock('ora', () => {
  return jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis()
  }));
});

// Mock prompts with default values
jest.mock('../src/utils/prompts', () => ({
  getInstallLocation: jest.fn().mockResolvedValue('local'),
  selectAgents: jest.fn().mockResolvedValue(['ARCHITECT']),
  getCustomAgentMetadata: jest.fn().mockResolvedValue({
    description: 'Test agent',
    model: 'sonnet',
    color: 'blue'
  }),
  confirmOverwrite: jest.fn().mockResolvedValue(false),
  AVAILABLE_AGENTS: [
    { name: 'ARCHITECT', value: 'ARCHITECT' },
    { name: 'DEVELOPER', value: 'DEVELOPER' }
  ]
}));

describe('Commands Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.exit mock
    process.exit = jest.fn();
  });

  describe('init command', () => {

    test('should create directory for global installation', async () => {
      createDirectory.mockReturnValue('/test/path');
      copyAgents.mockResolvedValue(undefined);
      copyProtocol.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      const options = {
        global: true,
        yes: true
      };

      await init(options);

      expect(createDirectory).toHaveBeenCalledWith('global');
    });

    test('should create directory for local installation', async () => {
      createDirectory.mockReturnValue('/test/path');
      copyAgents.mockResolvedValue(undefined);
      copyProtocol.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      const options = {
        local: true,
        yes: true
      };

      await init(options);

      expect(createDirectory).toHaveBeenCalledWith('local');
    });

    test('should default to local when --yes flag is used', async () => {
      createDirectory.mockReturnValue('/test/path');
      copyAgents.mockResolvedValue(undefined);
      copyProtocol.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      const options = {
        yes: true
      };

      await init(options);

      expect(createDirectory).toHaveBeenCalledWith('local');
    });

    test('should copy protocol documentation', async () => {
      createDirectory.mockReturnValue('/test/path');
      copyAgents.mockResolvedValue(undefined);
      copyProtocol.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      const options = {
        global: true,
        yes: true
      };

      await init(options);

      expect(copyProtocol).toHaveBeenCalledWith('global');
    });

    test('should handle errors gracefully', async () => {
      createDirectory.mockImplementation(() => {
        throw new Error('Directory creation failed');
      });

      const options = {
        yes: true
      };

      await init(options);

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('create command - Security', () => {

    test('should reject empty agent name', async () => {
      await create('', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should reject whitespace-only agent name', async () => {
      await create('   ', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    test('should reject agent name with forward slash', async () => {
      await create('path/to/agent', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(createCustomAgent).not.toHaveBeenCalled();
    });

    test('should reject agent name with backslash', async () => {
      await create('path\\to\\agent', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(createCustomAgent).not.toHaveBeenCalled();
    });

    test('should reject agent name with double dots', async () => {
      await create('..', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(createCustomAgent).not.toHaveBeenCalled();
    });

    test('should reject path traversal attempt', async () => {
      await create('../../../etc/passwd', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(createCustomAgent).not.toHaveBeenCalled();
    });

    test('should normalize agent name to uppercase', async () => {
      createDirectory.mockReturnValue('/test/path');
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('my-custom-agent', { local: true });

      expect(createCustomAgent).toHaveBeenCalledWith(
        'MY-CUSTOM-AGENT',
        'local',
        expect.objectContaining({
          description: 'Test agent',
          model: 'sonnet',
          color: 'blue'
        })
      );
    });

    test('should replace spaces with hyphens in agent name', async () => {
      createDirectory.mockReturnValue('/test/path');
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('my custom agent', { local: true });

      expect(createCustomAgent).toHaveBeenCalledWith(
        'MY-CUSTOM-AGENT',
        'local',
        expect.objectContaining({
          description: 'Test agent'
        })
      );
    });

    test('should handle valid agent name correctly', async () => {
      createDirectory.mockReturnValue('/test/path');
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('ValidAgent', { local: true });

      expect(createCustomAgent).toHaveBeenCalled();
    });
  });

  describe('create command - Functionality', () => {

    test('should create agent in global location when --global flag is used', async () => {
      createDirectory.mockReturnValue('/test/path');
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('TestAgent', { global: true });

      expect(createCustomAgent).toHaveBeenCalledWith(
        'TESTAGENT',
        'global',
        expect.objectContaining({
          description: 'Test agent',
          model: 'sonnet',
          color: 'blue'
        })
      );
    });

    test('should create agent in local location when --local flag is used', async () => {
      createDirectory.mockReturnValue('/test/path');
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('TestAgent', { local: true });

      expect(createCustomAgent).toHaveBeenCalledWith(
        'TESTAGENT',
        'local',
        expect.objectContaining({
          description: 'Test agent'
        })
      );
    });

    test('should create directory before creating agent', async () => {
      const mockPath = '/test/path';
      createDirectory.mockReturnValue(mockPath);
      createCustomAgent.mockResolvedValue(undefined);
      agentExists.mockReturnValue(false);

      await create('TestAgent', { local: true });

      expect(createDirectory).toHaveBeenCalledWith('local');
      expect(createDirectory).toHaveBeenCalledBefore(createCustomAgent);
    });

    test('should handle errors gracefully', async () => {
      createDirectory.mockImplementation(() => {
        throw new Error('Failed to create directory');
      });

      await create('TestAgent', { local: true });

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});

// Custom matcher for call order
expect.extend({
  toHaveBeenCalledBefore(received, other) {
    const receivedCalls = received.mock.invocationCallOrder;
    const otherCalls = other.mock.invocationCallOrder;

    if (receivedCalls.length === 0) {
      return {
        pass: false,
        message: () => 'Expected function was not called'
      };
    }

    if (otherCalls.length === 0) {
      return {
        pass: false,
        message: () => 'Comparison function was not called'
      };
    }

    const pass = receivedCalls[0] < otherCalls[0];

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received.getMockName()} not to be called before ${other.getMockName()}`
          : `Expected ${received.getMockName()} to be called before ${other.getMockName()}`
    };
  }
});

const { sanitizeAgentName } = require('../src/utils/fileOperations');

describe('Security Tests - sanitizeAgentName()', () => {
  describe('Path Traversal Protection', () => {
    test('should reject path with ../', () => {
      expect(() => {
        sanitizeAgentName('../malicious');
      }).toThrow('Agent name cannot contain path separators');
    });

    test('should reject forward slash', () => {
      expect(() => {
        sanitizeAgentName('path/to/file');
      }).toThrow('Agent name cannot contain path separators');
    });

    test('should reject backslash', () => {
      expect(() => {
        sanitizeAgentName('path\\to\\file');
      }).toThrow('Agent name cannot contain path separators');
    });
  });

  describe('Valid Input Acceptance', () => {
    test('should accept uppercase letters', () => {
      expect(() => sanitizeAgentName('ARCHITECT')).not.toThrow();
      expect(sanitizeAgentName('ARCHITECT')).toBe('ARCHITECT');
    });

    test('should accept hyphens and underscores', () => {
      expect(() => sanitizeAgentName('MY-AGENT_123')).not.toThrow();
      expect(sanitizeAgentName('MY-AGENT_123')).toBe('MY-AGENT_123');
    });
  });
});

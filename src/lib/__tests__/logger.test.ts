import { logger } from '../logger';

// Mock fetch for server logging
global.fetch = jest.fn();

describe('Logger', () => {
  const originalEnv = process.env;

  // Mock console methods
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock NODE_ENV for development
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
    });

    // Set up spies after clearing mocks
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message', { data: 'test' });

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO: Test info message$/),
        { data: 'test' }
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message', { warning: true });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] WARN: Test warning message$/),
        { warning: true }
      );
    });
  });

  describe('error', () => {
    it('should log error messages with error details', () => {
      const testError = new Error('Test error');
      logger.error('Test error message', testError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] ERROR: Test error message$/),
        testError
      );
    });
  });
});

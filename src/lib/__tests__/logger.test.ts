import { logger } from '../logger';

// Mock console methods
const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

// Mock fetch for server logging
global.fetch = jest.fn();

describe('Logger', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      logger.debug('Test debug message', { key: 'value' });

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] DEBUG:/),
        'Test debug message',
        { key: 'value' }
      );
    });

    it('should not log debug messages in production', () => {
      process.env.NODE_ENV = 'production';

      logger.debug('Test debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message', { data: 'test' });

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO:/),
        'Test info message',
        { data: 'test' }
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message', { warning: true });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] WARN:/),
        'Test warning message',
        { warning: true }
      );
    });
  });

  describe('error', () => {
    it('should log error messages with error details', () => {
      const testError = new Error('Test error');
      logger.error('Test error message', testError);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] ERROR:/),
        'Test error message',
        testError
      );
    });
  });

  describe('trackEvent', () => {
    it('should track events', () => {
      logger.trackEvent('test_event', { eventData: 'value' });

      // Event tracking doesn't log to console, just queues for server
      expect(global.fetch).not.toHaveBeenCalled(); // Not flushed yet
    });
  });

  describe('batch processing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should flush logs periodically', () => {
      logger.info('Test message');

      expect(global.fetch).not.toHaveBeenCalled();

      // Fast-forward time
      jest.advanceTimersByTime(31000);

      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

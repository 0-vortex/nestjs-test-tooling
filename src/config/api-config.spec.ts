import { ApiConfig } from './api.config';

describe('ApiConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...originalEnv }; // Reset to original environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should use default values if environment variables are not set', () => {
    const config = ApiConfig();
    expect(config.logging).toBe('debug');
    expect(config.host).toBe('0.0.0.0');
    expect(config.port).toBe('3001');
    expect(config.development).not.toBe(undefined);
    expect(config.memory_heap).toBe(200 * 1024 * 1024);
    expect(config.memory_rss).toBe(3000 * 1024 * 1024);
    expect(config.disk_percentage).toBe(0.95);
    expect(config.disk_size).toBe(1000 * 1024 * 1024 * 1024);
  });

  it('should use environment variables when they are set', () => {
    process.env.NODE_ENV = 'production';
    process.env.API_HOST = '127.0.0.1';
    process.env.API_PORT = '8080';
    process.env.CI = 'true';
    process.env.MEMORY_HEAP = '500';
    process.env.MEMORY_RSS = '4000';
    process.env.DISK_PERCENTAGE = '0.80';
    process.env.DISK_SIZE = '2000';

    const config = ApiConfig();
    expect(config.logging).toBe('info');
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe('8080');
    expect(config.development).toBe(false);
    expect(config.memory_heap).toBe(500 * 1024 * 1024);
    expect(config.memory_rss).toBe(4000 * 1024 * 1024);
    expect(config.disk_percentage).toBe(0.8);
    expect(config.disk_size).toBe(2000 * 1024 * 1024 * 1024);
  });
});

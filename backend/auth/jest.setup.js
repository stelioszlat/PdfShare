// Jest setup file
process.env.SECRET = 'alksdjfhasdkfhjaskdhf';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_PASSWORD = '';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
};
// Mock the database module
jest.mock('./config/database', () => ({
  menuDb: {
    all: jest.fn(),
    run: jest.fn(),
    close: jest.fn()
  }
}));

beforeAll(() => {
  // Reset all mocks before each test suite
  jest.clearAllMocks();
});

afterAll(() => {
  // Clean up mocks
  jest.resetAllMocks();
});
export function createMockSupabaseClient(mockData = [], mockCount = 0, mockError = null) {
  const mockQuery = {
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({ data: mockData, error: mockError, count: mockCount }),
    select: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: mockData.length === 1 ? mockData[0] : null, error: mockError }),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
  };

  const mockFrom = jest.fn(() => mockQuery);

  return {
    from: mockFrom,
  };
}

export type MockRepository<T = any> = {
  findOne: jest.Mock<Promise<T | null>, any[]>;
  find: jest.Mock<Promise<T[]>, any[]>;
  findAndCount: jest.Mock<Promise<[T[], number]>, any[]>;
  create: jest.Mock<T, any[]>;
  save: jest.Mock<Promise<T>, any[]>;
  preload: jest.Mock<Promise<T | undefined>, any[]>;
  findOneBy: jest.Mock<Promise<T | null>, any[]>;
  findBy: jest.Mock<Promise<T[]>, any[]>;
};

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
});

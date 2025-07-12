import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s', '!**/*.(model|module|config).(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
      '@models/(.*)': '<rootDir>/models/$1',
      '@common/(.*)': '<rootDir>/common/$1',
      '@config/(.*)': '<rootDir>/config/$1',
      '@src/(.*)': '<rootDir>/$1',
      '@root/(.*)': '<rootDir>/../$1',
    },
    setupFilesAfterEnv: ['../setup-tests.ts'],
  };
};

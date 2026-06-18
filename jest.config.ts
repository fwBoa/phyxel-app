import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$':          '<rootDir>/src/$1',
    '^server-only$':     '<rootDir>/src/__mocks__/server-only.ts',
    '^next/headers$':    '<rootDir>/src/__mocks__/next-headers.ts',
    '^next/navigation$': '<rootDir>/src/__mocks__/next-navigation.ts',
    '^next/image$':      '<rootDir>/src/__mocks__/next-image.tsx',
    '^motion/react$':    '<rootDir>/src/__mocks__/motion.tsx',
    '^motion$':          '<rootDir>/src/__mocks__/motion.tsx',
    '^gsap$':            '<rootDir>/src/__mocks__/gsap.ts',
    '^gsap/(.*)$':       '<rootDir>/src/__mocks__/gsap.ts',
    '^@gsap/react$':     '<rootDir>/src/__mocks__/gsap.ts',
    '\\.(css|scss)$':    'identity-obj-proxy',
    '^jose$':            '<rootDir>/src/__mocks__/jose.ts',
    '^jose/(.*)$':       '<rootDir>/src/__mocks__/jose.ts',
  },
  transformIgnorePatterns: ['/node_modules/(?!(jose|motion|@motionone)/)'],
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    'src/app/api/**/*.ts',
    'src/components/**/*.tsx',
    '!src/**/*.d.ts',
  ],
}

export default createJestConfig(config)

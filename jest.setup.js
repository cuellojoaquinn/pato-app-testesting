import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.confirm
global.confirm = jest.fn()

// Mock window.setTimeout
global.setTimeout = jest.fn((callback, delay) => {
  if (delay === 0) {
    callback()
  }
  return 1
})

// Mock window.clearTimeout
global.clearTimeout = jest.fn() 
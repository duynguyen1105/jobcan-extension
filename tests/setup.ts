import '@testing-library/jest-dom'

// Provide a #popup element so the module-level render() in popup.tsx doesn't crash
const popupDiv = document.createElement('div')
popupDiv.id = 'popup'
document.body.appendChild(popupDiv)

const chromeMock = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn((_key: string, cb: (result: Record<string, unknown>) => void) => cb({})),
      set: jest.fn(),
    },
  },
}

Object.defineProperty(global, 'chrome', {
  value: chromeMock,
  writable: true,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

beforeEach(() => {
  jest.clearAllMocks()
  // Re-setup storage mock default after clearAllMocks
  ;(chrome.storage.local.get as jest.Mock).mockImplementation(
    (_key: string, cb: (result: Record<string, unknown>) => void) => cb({})
  )
})

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
}

Object.defineProperty(global, 'chrome', {
  value: chromeMock,
  writable: true,
})

beforeEach(() => {
  jest.clearAllMocks()
})

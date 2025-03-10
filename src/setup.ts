import { vi } from "vitest"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock window.HTMLElement
if (typeof window !== "undefined") {
  Object.defineProperty(window, "HTMLElement", {
    value: class HTMLElement extends Element {
      scrollIntoView() {}
    },
  })
}

// Mock scroll behavior
window.HTMLElement.prototype.scrollIntoView = function () {}

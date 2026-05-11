// crypto.randomUUID is available in React Native 0.73+ but not in the Jest/jsdom environment
if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  let counter = 0
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => `test-uuid-${++counter}`,
    },
    writable: true,
  })
}

module.exports = {
  getStatusAsync: () => Promise.resolve(2),
  registerTaskAsync: () => Promise.resolve(),
  unregisterTaskAsync: () => Promise.resolve(),
  BackgroundTaskResult: { Success: 1, Failed: 2 },
  BackgroundTaskStatus: { Restricted: 1, Available: 2 },
}

// Stub for react-native/Libraries/NativeComponent/ViewConfigIgnore.js
// The real file uses Flow's `const T:` generic syntax which hermes-parser 0.25 cannot parse.
// This stub is equivalent in behavior for the jest environment.

function DynamicallyInjectedByGestureHandler(object) {
  return object
}

function ConditionallyIgnoredEventHandlers(value) {
  return value
}

function isIgnored() {
  return false
}

module.exports = {
  DynamicallyInjectedByGestureHandler,
  ConditionallyIgnoredEventHandlers,
  isIgnored,
}

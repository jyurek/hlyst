jest.mock('../src/screens/LibraryScreen', () => ({ LibraryScreen: () => null }))
jest.mock('../src/db/database', () => ({ openDatabase: jest.fn() }))
jest.mock('../src/services/subscriptionService', () => ({
  createSubscriptionService: jest.fn(),
}))

import App from '../App'

it('App exports a React component', () => {
  expect(typeof App).toBe('function')
})

import React, { createElement } from 'react'
import { create, act } from 'react-test-renderer'

jest.mock('react-native', () => {
  const React = require('react')
  const mockView = (props: Record<string, unknown>) =>
    React.createElement('View', { testID: props.testID }, props.children)
  const mockText = (props: Record<string, unknown>) =>
    React.createElement('Text', { testID: props.testID }, props.children)
  return {
    View: mockView,
    Text: mockText,
    StyleSheet: { create: (s: unknown) => s, hairlineWidth: 1 },
  }
})

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { QueueScreen } =
  require('../../src/screens/QueueScreen') as typeof import('../../src/screens/QueueScreen')

function findText(node: unknown, text: string): boolean {
  if (!node || typeof node !== 'object') return false
  const n = node as { children?: unknown[]; type?: string; props?: Record<string, unknown> }
  if (n.children) {
    for (const child of n.children) {
      if (child === text) return true
      if (findText(child, text)) return true
    }
  }
  return false
}

it('renders the Queue heading', () => {
  let instance!: ReturnType<typeof create>
  act(() => {
    instance = create(createElement(QueueScreen, null))
  })
  expect(findText(instance.toJSON(), 'Queue')).toBe(true)
})

it('renders the empty state text', () => {
  let instance!: ReturnType<typeof create>
  act(() => {
    instance = create(createElement(QueueScreen, null))
  })
  expect(findText(instance.toJSON(), 'Nothing queued yet.')).toBe(true)
})

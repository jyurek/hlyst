import React from 'react'
import { act, create } from 'react-test-renderer'

// Provide simple React components in place of react-native primitives to avoid
// hermes-parser 0.25 failing on the `const T:` Flow generic syntax in
// react-native 0.81's NativeComponent/ViewConfigIgnore.js.
// When jest.mock is hoisted it replaces the jest-expo setup-file mock so
// requireActual of the real Text / View never runs.
jest.mock('react-native', () => {
  const React = require('react')

  function View({ children, style, testID, ...rest }: Record<string, unknown>) {
    return React.createElement('View', { style, testID, ...rest }, children)
  }
  function Text({ children, style, testID, numberOfLines, ...rest }: Record<string, unknown>) {
    return React.createElement('Text', { style, testID, numberOfLines, ...rest }, children)
  }
  function Pressable({
    children,
    onPress,
    testID,
    disabled,
    accessibilityLabel,
  }: Record<string, unknown>) {
    return React.createElement(
      'Pressable',
      { onPress, testID, disabled, accessibilityLabel },
      children,
    )
  }
  function Image({ style, testID }: Record<string, unknown>) {
    return React.createElement('Image', { style, testID })
  }

  const Animated = {
    Value: class AnimatedValue {
      constructor(value: number) {
        this._value = value
      }
      _value: number
      setValue(v: number) {
        this._value = v
      }
      interpolate() {
        return this
      }
    },
    timing: (_value: unknown, _config: unknown) => ({
      start: (cb?: () => void) => cb?.(),
    }),
    spring: (_value: unknown, _config: unknown) => ({
      start: (cb?: () => void) => cb?.(),
    }),
    View: View,
    createAnimatedComponent: (component: unknown) => component,
  }

  const PanResponder = {
    create: (_config: unknown) => ({
      panHandlers: {},
    }),
  }

  const StyleSheet = {
    create: (styles: unknown) => styles,
    flatten: (style: unknown) => style,
  }

  const Dimensions = {
    get: (_dim: string) => ({ width: 390, height: 844 }),
  }

  function useWindowDimensions() {
    return { width: 390, height: 844 }
  }

  return {
    View,
    Text,
    Pressable,
    Image,
    Animated,
    PanResponder,
    StyleSheet,
    Dimensions,
    useWindowDimensions,
  }
})

import { QueueSheet, type QueueItem } from '../../src/components/QueueSheet'
import type { Episode } from '../../src/db/types'

const baseEpisode: Episode = {
  id: 'ep-1',
  subscriptionId: 'sub-1',
  guid: 'guid-ep-1',
  title: 'Test Episode Title',
  description: null,
  duration: null,
  publishedAt: null,
  mediaUrl: 'https://example.com/ep1.mp3',
  fileSize: null,
  downloadStatus: 'none',
  localPath: null,
  playedAt: null,
  isArchived: false,
  createdAt: 1000,
}

const makeQueueItem = (id: string, position: number, titleOverride?: string): QueueItem => ({
  id,
  episodeId: id,
  position,
  episode: {
    ...baseEpisode,
    id,
    title: titleOverride ?? `Episode ${id}`,
  },
})

const baseProps = {
  onDismiss: jest.fn(),
  currentEpisode: null as Episode | null,
  currentPodcastName: null as string | null,
  queueItems: [] as QueueItem[],
  onRemove: jest.fn(),
  onReorder: jest.fn(),
}

/** Walk the rendered JSON tree and return all nodes matching a testID */
function findAllByTestId(instance: ReturnType<typeof create>, testID: string): unknown[] {
  const results: unknown[] = []
  function walk(node: unknown): void {
    if (!node || typeof node !== 'object') return
    const n = node as Record<string, unknown>
    if (n.props && (n.props as Record<string, unknown>).testID === testID) {
      results.push(n)
    }
    if (Array.isArray(n.children)) {
      for (const child of n.children as unknown[]) walk(child)
    }
  }
  walk(instance.toJSON())
  return results
}

function findByTestId(
  instance: ReturnType<typeof create>,
  testID: string,
): Record<string, unknown> {
  const results = findAllByTestId(instance, testID)
  if (results.length === 0) throw new Error(`No element with testID="${testID}" found`)
  return results[0] as Record<string, unknown>
}

/** Press the first matching testID node */
function press(instance: ReturnType<typeof create>, testID: string): void {
  const node = findByTestId(instance, testID) as {
    props: { onPress?: () => void }
  }
  act(() => {
    node.props.onPress?.()
  })
}

describe('QueueSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('is present in the tree but non-interactive when visible is false', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(<QueueSheet {...baseProps} visible={false} />)
    })
    const results = findAllByTestId(instance, 'queue-sheet')
    expect(results).toHaveLength(1)
    const node = results[0] as { props: Record<string, unknown> }
    expect(node.props.pointerEvents).toBe('none')
  })

  it('is present in the tree even when visible is false', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(<QueueSheet {...baseProps} visible={false} />)
    })
    const results = findAllByTestId(instance, 'queue-sheet')
    expect(results).toHaveLength(1)
  })

  it('renders the sheet when visible is true', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(<QueueSheet {...baseProps} visible={true} />)
    })
    const results = findAllByTestId(instance, 'queue-sheet')
    expect(results.length).toBeGreaterThan(0)
    const node = results[0] as { props: Record<string, unknown> }
    expect(node.props.pointerEvents).toBe('auto')
  })

  it('shows the now-playing episode title', () => {
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        <QueueSheet
          {...baseProps}
          visible={true}
          currentEpisode={baseEpisode}
          currentPodcastName="My Podcast"
        />,
      )
    })
    // react-test-renderer JSON: text content is in `children`, not `props.children`
    const node = findByTestId(instance, 'now-playing-title') as {
      children: string[]
    }
    expect(node.children[0]).toBe('Test Episode Title')
  })

  it('renders queue items in the Up Next section', () => {
    const items: QueueItem[] = [makeQueueItem('qi-1', 0), makeQueueItem('qi-2', 1)]
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(<QueueSheet {...baseProps} visible={true} queueItems={items} />)
    })
    expect(findAllByTestId(instance, 'queue-item-qi-1')).toHaveLength(1)
    expect(findAllByTestId(instance, 'queue-item-qi-2')).toHaveLength(1)
  })

  it('calls onRemove with the correct queue item id when ✕ is pressed', () => {
    const onRemove = jest.fn()
    const items: QueueItem[] = [makeQueueItem('qi-1', 0), makeQueueItem('qi-2', 1)]
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        <QueueSheet {...baseProps} visible={true} queueItems={items} onRemove={onRemove} />,
      )
    })
    press(instance, 'remove-qi-2')
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith('qi-2')
  })

  it('calls onReorder with correct indices when ▲ is pressed', () => {
    const onReorder = jest.fn()
    const items: QueueItem[] = [makeQueueItem('qi-1', 0), makeQueueItem('qi-2', 1)]
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        <QueueSheet {...baseProps} visible={true} queueItems={items} onReorder={onReorder} />,
      )
    })
    // Move second item up: fromIndex=1, toIndex=0
    press(instance, 'move-up-qi-2')
    expect(onReorder).toHaveBeenCalledTimes(1)
    expect(onReorder).toHaveBeenCalledWith(1, 0)
  })

  it('calls onReorder with correct indices when ▼ is pressed', () => {
    const onReorder = jest.fn()
    const items: QueueItem[] = [makeQueueItem('qi-1', 0), makeQueueItem('qi-2', 1)]
    let instance!: ReturnType<typeof create>
    act(() => {
      instance = create(
        <QueueSheet {...baseProps} visible={true} queueItems={items} onReorder={onReorder} />,
      )
    })
    // Move first item down: fromIndex=0, toIndex=1
    press(instance, 'move-down-qi-1')
    expect(onReorder).toHaveBeenCalledTimes(1)
    expect(onReorder).toHaveBeenCalledWith(0, 1)
  })
})

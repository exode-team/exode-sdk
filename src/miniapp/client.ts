import { Bridge } from './bridge'
import type {
  ExodeMiniAppConfig,
  MiniAppContext,
  MiniAppInitResult,
  MiniAppEventMap,
  MiniAppEventType,
  MiniAppCommandMap,
  MiniAppCommandType,
  BridgeMessage,
} from './types'

const DEFAULT_TIMEOUT = 10_000

export class ExodeMiniApp {

  /** Navigation commands */
  readonly route = {
    navigate: (path: string, params?: Record<string, string>): Promise<void> => {
      return this.sendCommand('navigate', { path, params })
    },
    back: (): Promise<void> => {
      return this.sendCommand('navigate:back', undefined)
    },
  }

  /** UI control commands */
  readonly ui = {
    showSnackbar: (params: MiniAppCommandMap['showSnackbar']): Promise<void> => {
      return this.sendCommand('showSnackbar', params)
    },
    setTabbarVisible: (visible: boolean): Promise<void> => {
      return this.sendCommand('setTabbarVisible', { visible })
    },
    setHeaderVisible: (visible: boolean): Promise<void> => {
      return this.sendCommand('setHeaderVisible', { visible })
    },
    close: (): Promise<void> => {
      return this.sendCommand('close', undefined)
    },
  }

  private bridge: Bridge | null = null
  private context: MiniAppContext | null = null
  private readonly config: Required<ExodeMiniAppConfig>
  private eventListeners = new Map<string, Set<(payload: unknown) => void>>()

  constructor(config: ExodeMiniAppConfig) {
    if (!config.appId) {
      throw new Error('ExodeMiniApp: appId is required')
    }

    this.config = {
      appId: config.appId,
      targetOrigin: config.targetOrigin ?? '*',
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
    }
  }

  async init(): Promise<MiniAppContext> {
    if (this.bridge) {
      throw new Error('ExodeMiniApp is already initialized')
    }

    if (!window.parent || window.parent === window) {
      throw new Error('ExodeMiniApp must be used inside an iframe')
    }

    this.bridge = new Bridge({
      source: 'exode-miniapp',
      targetOrigin: this.config.targetOrigin,
      targetWindow: window.parent,
    })

    this.subscribeToEvents()

    const result = await this.bridge.sendRequest<{ appId: string }, MiniAppInitResult>(
      'init',
      { appId: this.config.appId },
      this.config.timeout,
    )

    this.context = result.context

    return this.context
  }

  getContext(): MiniAppContext | null {
    return this.context
  }

  on<E extends MiniAppEventType>(event: E, handler: (payload: MiniAppEventMap[E]) => void): () => void {
    const set = this.eventListeners.get(event)
    const wrappedHandler = handler as (payload: unknown) => void

    if (set) {
      set.add(wrappedHandler)
    } else {
      this.eventListeners.set(event, new Set([wrappedHandler]))
    }

    return () => {
      this.eventListeners.get(event)?.delete(wrappedHandler)
    }
  }

  destroy(): void {
    this.bridge?.destroy()
    this.bridge = null
    this.context = null
    this.eventListeners.clear()
  }

  private async sendCommand<C extends MiniAppCommandType>(
    type: C,
    payload: MiniAppCommandMap[C],
  ): Promise<void> {
    if (!this.bridge) {
      throw new Error('ExodeMiniApp is not initialized. Call init() first.')
    }

    await this.bridge.sendRequest<MiniAppCommandMap[C], void>(
      `command:${type}`,
      payload,
      this.config.timeout,
    )
  }

  private subscribeToEvents(): void {
    if (!this.bridge) return

    this.bridge.on('event', (message: BridgeMessage) => {
      const eventPayload = message.payload
      if (!eventPayload || typeof eventPayload !== 'object') return

      const { type, payload } = eventPayload as { type?: string; payload?: unknown }
      if (typeof type !== 'string') return

      if (type === 'context:updated' && this.context && payload && typeof payload === 'object') {
        Object.assign(this.context, payload)
      }

      const handlers = this.eventListeners.get(type)
      if (handlers) {
        for (const handler of handlers) {
          try {
            handler(payload)
          } catch {
            // prevent handler error from breaking event loop
          }
        }
      }
    })
  }

}

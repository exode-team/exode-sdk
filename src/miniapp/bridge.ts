import type { BridgeMessage } from './types'

type MessageHandler = (message: BridgeMessage) => void

const EXODE_SOURCES = new Set(['exode-host', 'exode-miniapp'])

function isValidBridgeMessage(data: unknown): data is BridgeMessage {
  if (!data || typeof data !== 'object') return false
  const msg = data as Record<string, unknown>
  return (
    typeof msg.type === 'string'
    && msg.type.length > 0
    && typeof msg.source === 'string'
    && EXODE_SOURCES.has(msg.source)
  )
}

export class Bridge {

  private handlers = new Map<string, Set<MessageHandler>>()
  private readonly source: BridgeMessage['source']
  private readonly targetOrigin: string
  private readonly targetWindow: Window
  private destroyed = false

  constructor(params: {
    source: BridgeMessage['source']
    targetOrigin: string
    targetWindow: Window
  }) {
    this.source = params.source
    this.targetOrigin = params.targetOrigin
    this.targetWindow = params.targetWindow

    window.addEventListener('message', this.handleMessage)
  }

  send<T>(type: string, payload?: T, requestId?: string): void {
    if (this.destroyed) return

    const message: BridgeMessage<T> = {
      type,
      payload,
      requestId,
      source: this.source,
    }

    this.targetWindow.postMessage(message, this.targetOrigin)
  }

  sendRequest<TPayload, TResult>(type: string, payload?: TPayload, timeout = 10_000): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      if (this.destroyed) {
        reject(new Error('Bridge is destroyed'))
        return
      }

      const requestId = `${type}:${Date.now()}:${Math.random().toString(36).slice(2)}`

      const timer = setTimeout(() => {
        this.off(`${type}:result`, handler)
        reject(new Error(`Request "${type}" timed out after ${timeout}ms`))
      }, timeout)

      const handler = (message: BridgeMessage) => {
        if (message.requestId !== requestId) return

        clearTimeout(timer)
        this.off(`${type}:result`, handler)
        resolve(message.payload as TResult)
      }

      this.on(`${type}:result`, handler)
      this.send(type, payload, requestId)
    })
  }

  on(type: string, handler: MessageHandler): void {
    const set = this.handlers.get(type)
    if (set) {
      set.add(handler)
    } else {
      this.handlers.set(type, new Set([handler]))
    }
  }

  off(type: string, handler: MessageHandler): void {
    this.handlers.get(type)?.delete(handler)
  }

  destroy(): void {
    this.destroyed = true
    window.removeEventListener('message', this.handleMessage)
    this.handlers.clear()
  }

  private handleMessage = (event: MessageEvent): void => {
    if (this.destroyed) return
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return
    if (!isValidBridgeMessage(event.data)) return
    if (event.data.source === this.source) return

    const handlers = this.handlers.get(event.data.type)
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event.data)
        } catch {
          // prevent one handler error from breaking others
        }
      }
    }
  }

}

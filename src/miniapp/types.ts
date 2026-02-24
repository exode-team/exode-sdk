import type { Platform } from '../shared/types'

// Bridge protocol

export interface BridgeMessage<T = unknown> {
  type: string
  requestId?: string
  payload?: T
  source: 'exode-host' | 'exode-miniapp'
}

// Context

export interface MiniAppContext {
  user: MiniAppUser
  school: Record<string, unknown>
  theme: MiniAppTheme
  platform: Platform
  config: MiniAppConfig
}

export interface MiniAppUser {
  id: number
  uuid: string | null
  firstName: string | null
  lastName: string | null
  avatar: {
    id: number
    small: string | null
    medium: string | null
    maximum: string | null
  } | null
  email: string | null
  phone: string | null
  role: string
  language: string | null
}

export interface MiniAppTheme {
  scheme: 'light' | 'dark'
}

export interface MiniAppConfig {
  isDesktop: boolean
  isMobile: boolean
  language: string
}

// Events (Host → MiniApp)

export type MiniAppEventMap = {
  'theme:changed': MiniAppTheme
  'user:updated': MiniAppUser
  'route:changed': { path: string; params: Record<string, string> }
  'context:updated': Partial<MiniAppContext>
  'visibility:changed': { visible: boolean }
}

export type MiniAppEventType = keyof MiniAppEventMap

// Commands (MiniApp → Host)

export type MiniAppCommandMap = {
  'navigate': { path: string; params?: Record<string, string> }
  'navigate:back': undefined
  'showSnackbar': { message: string; type?: 'success' | 'error' | 'info' }
  'setTabbarVisible': { visible: boolean }
  'setHeaderVisible': { visible: boolean }
  'close': undefined
}

export type MiniAppCommandType = keyof MiniAppCommandMap

// Init

export interface MiniAppInitPayload {
  appId: string
}

export interface MiniAppInitResult {
  context: MiniAppContext
}

// Client config

export interface ExodeMiniAppConfig {
  appId: string
  targetOrigin?: string
  timeout?: number
}

import { createElement, createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { ExodeMiniApp } from './client'
import type {
  MiniAppContext,
  MiniAppCommandMap,
  ExodeMiniAppConfig,
} from './types'
import type { Platform } from '../shared/types'

// --- Context ---

interface ExodeMiniAppContextValue {
  app: ExodeMiniApp
  context: MiniAppContext | null
  isReady: boolean
  error: Error | null
}

const ExodeMiniAppContext = createContext<ExodeMiniAppContextValue | null>(null)

function useExodeContext(): ExodeMiniAppContextValue {
  const ctx = useContext(ExodeMiniAppContext)
  if (!ctx) {
    throw new Error('useExode* hooks must be used inside <ExodeMiniAppProvider>')
  }
  return ctx
}

// --- Provider ---

export interface ExodeMiniAppProviderProps {
  config: ExodeMiniAppConfig
  children: ReactNode
}

export function ExodeMiniAppProvider({ config, children }: ExodeMiniAppProviderProps) {
  const appRef = useRef<ExodeMiniApp | null>(null)
  const [context, setContext] = useState<MiniAppContext | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const app = new ExodeMiniApp(config)
    appRef.current = app

    let cancelled = false

    app.init()
      .then((ctx) => {
        if (cancelled) return
        setContext({ ...ctx })
        setIsReady(true)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error(String(err)))
      })

    const unsubUser = app.on('user:updated', (user) => {
      if (!cancelled) setContext((prev) => prev ? { ...prev, user } : null)
    })

    const unsubTheme = app.on('theme:changed', (theme) => {
      if (!cancelled) setContext((prev) => prev ? { ...prev, theme } : null)
    })

    const unsubSchool = app.on('school:updated', (school) => {
      if (!cancelled) setContext((prev) => prev ? { ...prev, school } : null)
    })

    const unsubConfig = app.on('config:updated', (config) => {
      if (!cancelled) setContext((prev) => prev ? { ...prev, config } : null)
    })

    const unsubContext = app.on('context:updated', (partial) => {
      if (!cancelled) setContext((prev) => prev ? { ...prev, ...partial } : null)
    })

    const unsubRoute = app.on('route:changed', () => {})

    return () => {
      cancelled = true
      unsubUser()
      unsubTheme()
      unsubSchool()
      unsubConfig()
      unsubContext()
      unsubRoute()
      app.destroy()
      appRef.current = null
      setIsReady(false)
      setContext(null)
      setError(null)
    }
  }, [config.appId])

  const value: ExodeMiniAppContextValue = {
    app: appRef.current!,
    context,
    isReady,
    error,
  }

  if (!appRef.current) return null

  return createElement(ExodeMiniAppContext.Provider, { value }, children)
}

// --- Hooks ---

/** App instance and readiness state */
export function useExodeApp() {
  const { app, isReady, error } = useExodeContext()
  return { app, isReady, error }
}

/** Current user from host app, auto-updates on changes */
export function useExodeUser() {
  const { context } = useExodeContext()

  return {
    user: context?.user ?? null,
    isLoggedIn: (context?.user?.id ?? 0) > 0,
  }
}

/** Current theme from host app, auto-updates on changes */
export function useExodeTheme() {
  const { context } = useExodeContext()

  return {
    scheme: context?.theme?.scheme ?? 'light',
    isDark: context?.theme?.scheme === 'dark',
  }
}

/** Current school data from host app */
export function useExodeSchool() {
  const { context } = useExodeContext()

  return {
    school: context?.school ?? null,
  }
}

/** App configuration (responsive, language) from host app */
export function useExodeConfig() {
  const { context } = useExodeContext()

  return {
    isDesktop: context?.config?.isDesktop ?? false,
    isMobile: context?.config?.isMobile ?? false,
    language: context?.config?.language ?? 'ru',
    platform: (context?.platform ?? 'web') as Platform,
  }
}

/** Navigation commands to host app */
export function useExodeNavigation() {
  const { app } = useExodeContext()

  const navigate = useCallback(
    (path: string, params?: Record<string, string>) => app.navigate(path, params),
    [app],
  )

  const navigateBack = useCallback(() => app.navigateBack(), [app])

  return { navigate, navigateBack }
}

/** UI control commands to host app */
export function useExodeUI() {
  const { app } = useExodeContext()

  const showSnackbar = useCallback(
    (params: MiniAppCommandMap['showSnackbar']) => app.showSnackbar(params),
    [app],
  )

  const setTabbarVisible = useCallback(
    (visible: boolean) => app.setTabbarVisible(visible),
    [app],
  )

  const setHeaderVisible = useCallback(
    (visible: boolean) => app.setHeaderVisible(visible),
    [app],
  )

  const close = useCallback(() => app.close(), [app])

  return { showSnackbar, setTabbarVisible, setHeaderVisible, close }
}

# MiniApp SDK

Клиентский bridge для iframe-миниприложений, работающих внутри Exode.

```
npm install @exode-team/sdk
```

## Как это работает

Миниприложение загружается в iframe внутри основного Exode-приложения. SDK обеспечивает двустороннюю связь через `postMessage`:

```
Exode App (host)          <──  postMessage  ──>          MiniApp (iframe)
- отправляет контекст                                    - получает user, school, theme
- слушает команды                                        - отправляет команды (navigate, snackbar)
- пушит обновления                                       - подписывается на события
```

При инициализации происходит handshake: miniapp отправляет свой `appId`, host валидирует origin и appId, затем возвращает контекст.

## Использование

### Vanilla JS / TypeScript

```typescript
import { ExodeMiniApp } from '@exode-team/sdk/miniapp'

const app = new ExodeMiniApp({ appId: 'my-app' })

// Handshake — получаем контекст от основного приложения
const ctx = await app.init()

ctx.user       // { id, uuid, firstName, lastName, avatar, email, phone, role, language }
ctx.school     // полный объект школы (id, name, domain, config, ...)
ctx.theme      // { scheme: 'light' | 'dark' }
ctx.platform   // 'web' | 'native'
ctx.config     // { isDesktop, isMobile, language }
```

### Подписка на события

Когда данные меняются в основном приложении, miniapp получает обновления:

```typescript
// Пользователь обновил профиль / сменил аккаунт
app.on('theme:changed', (theme) => {
  document.body.className = theme.scheme
})

// Тема изменилась
app.on('user:updated', (user) => {
  console.log('New user:', user.firstName)
})

// Маршрут изменился
app.on('route:changed', ({ path, params }) => {
  console.log('Host navigated to:', path)
})
```

### Команды

Отправка команд в основное приложение:

```typescript
// Навигация
await app.navigate('/course/123')
await app.navigateBack()

// Уведомления
await app.showSnackbar({ message: 'Сохранено!', type: 'success' })

// Управление UI
await app.setTabbarVisible(false)
await app.setHeaderVisible(false)

// Закрыть миниприложение
await app.close()
```

### Очистка

```typescript
// При размонтировании приложения
app.destroy()
```

## CDN (без сборки)

```html
<script src="https://cdn.exode.biz/sdk/miniapp.global.js"></script>
<script>
  const app = new ExodeMiniAppSDK.ExodeMiniApp({ appId: 'my-app' })

  app.init().then(function(ctx) {
    document.getElementById('user').textContent = ctx.user.firstName
    document.body.className = ctx.theme.scheme

    app.on('theme:changed', function(theme) {
      document.body.className = theme.scheme
    })
  })
</script>
```

## React-хуки

```
import { ... } from '@exode-team/sdk/miniapp/react'
```

### Provider

Оборачивает приложение, автоматически выполняет `init()` и подписывается на все события:

```tsx
import { ExodeMiniAppProvider } from '@exode-team/sdk/miniapp/react'

function App() {
  return (
    <ExodeMiniAppProvider config={{ appId: 'my-app' }}>
      <MyApp />
    </ExodeMiniAppProvider>
  )
}
```

### useExodeApp

Состояние подключения и низкоуровневый доступ к инстансу:

```tsx
const { app, isReady, error } = useExodeApp()

if (error) return <div>Connection error: {error.message}</div>
if (!isReady) return <div>Connecting to Exode...</div>
```

### useExodeUser

Текущий пользователь. Автоматически обновляется при изменении в основном приложении:

```tsx
const { user, isLoggedIn } = useExodeUser()

// user: { id, uuid, firstName, lastName, avatar, email, phone, role, language }
```

### useExodeTheme

Текущая тема. Обновляется при переключении темы в основном приложении:

```tsx
const { scheme, isDark } = useExodeTheme()

// scheme: 'light' | 'dark'
```

### useExodeSchool

Данные школы:

```tsx
const { school } = useExodeSchool()

// school: { id, name, domain, config, ... }
```

### useExodeConfig

Конфигурация приложения:

```tsx
const { isDesktop, isMobile, language, platform } = useExodeConfig()

// platform: 'web' | 'native'
// language: 'Ru' | 'En' | 'Uz' | 'Qa'
```

### useExodeNavigation

Навигация в основном приложении:

```tsx
const { navigate, navigateBack } = useExodeNavigation()

await navigate('/course/123', { tab: 'lessons' })
await navigateBack()
```

### useExodeUI

Управление UI основного приложения:

```tsx
const { showSnackbar, setTabbarVisible, setHeaderVisible, close } = useExodeUI()

await showSnackbar({ message: 'Done!', type: 'success' })
await setTabbarVisible(false)
await close()
```

## Конфигурация

```typescript
new ExodeMiniApp({
  appId: 'my-app',          // ID приложения (обязательно)
  targetOrigin: '*',         // Origin хоста (по умолчанию '*')
  timeout: 10000,            // Таймаут handshake в мс (по умолчанию 10000)
})
```

## Типы

```typescript
import type {
  MiniAppContext,     // Полный контекст (user + school + theme + config + platform)
  MiniAppUser,        // Данные пользователя
  MiniAppTheme,       // { scheme: 'light' | 'dark' }
  MiniAppConfig,      // { isDesktop, isMobile, language }
  MiniAppEventMap,    // Карта событий (host → miniapp)
  MiniAppCommandMap,  // Карта команд (miniapp → host)
  BridgeMessage,      // Формат postMessage-сообщения
  Platform,           // 'web' | 'native'
} from '@exode-team/sdk/miniapp'
```

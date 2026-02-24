# MiniApp SDK

Клиентский bridge для iframe-миниприложений, работающих внутри Exode.

```bash
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

### Vanilla JS

```js
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

```js
app.on('theme:changed', (theme) => {
  document.body.className = theme.scheme
})

app.on('user:updated', (user) => {
  console.log('New user:', user.firstName)
})

app.on('route:changed', ({ path, params }) => {
  console.log('Host navigated to:', path)
})
```

### Команды

Отправка команд в основное приложение:

```js
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

```js
// При размонтировании приложения
app.destroy()
```

## CDN (без сборки)

```html
<script src="https://cdn.exode.biz/sdk/miniapp.global.js"></script>
<script>
  var app = new ExodeMiniAppSDK.ExodeMiniApp({ appId: 'my-app' })

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

Все хуки реактивные — когда данные меняются в основном приложении (пользователь, тема, конфиг), компоненты автоматически перерисовываются с актуальными значениями.

```js
import { ... } from '@exode-team/sdk/miniapp/react'
```

### Provider

Оборачивает приложение, выполняет handshake и подписывается на все обновления от хоста:

```jsx
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

```jsx
function Status() {
  const { app, isReady, error } = useExodeApp()

  if (error) return <div>Connection error: {error.message}</div>
  if (!isReady) return <div>Connecting to Exode...</div>

  return <div>Connected</div>
}
```

### useExodeUser

Текущий пользователь. Обновляется при смене аккаунта или изменении профиля:

```jsx
function Greeting() {
  const { user, isLoggedIn } = useExodeUser()

  if (!isLoggedIn) return <div>Not logged in</div>

  return <div>Hello, {user.firstName}</div>
}
```

### useExodeTheme

Текущая тема. Обновляется при переключении светлой/тёмной темы:

```jsx
function ThemedBox() {
  const { scheme, isDark } = useExodeTheme()

  return (
    <div style={{ background: isDark ? '#1a1a1a' : '#ffffff' }}>
      Current scheme: {scheme}
    </div>
  )
}
```

### useExodeSchool

Данные текущей школы. Обновляются при смене школы:

```jsx
function SchoolInfo() {
  const { school } = useExodeSchool()

  return <div>{school?.name}</div>
}
```

### useExodeConfig

Конфигурация приложения. Обновляется при изменении размера окна или языка:

```jsx
function Layout() {
  const { isDesktop, isMobile, language, platform } = useExodeConfig()

  return (
    <div className={isMobile ? 'compact' : 'wide'}>
      {language} / {platform}
    </div>
  )
}
```

### useExodeNavigation

Навигация в основном приложении:

```jsx
function NavButtons() {
  const { navigate, navigateBack } = useExodeNavigation()

  return (
    <>
      <button onClick={() => navigate('/course/123', { tab: 'lessons' })}>
        Open course
      </button>
      <button onClick={() => navigateBack()}>
        Back
      </button>
    </>
  )
}
```

### useExodeUI

Управление UI основного приложения:

```jsx
function Controls() {
  const { showSnackbar, setTabbarVisible, setHeaderVisible, close } = useExodeUI()

  return (
    <>
      <button onClick={() => showSnackbar({ message: 'Done!', type: 'success' })}>
        Notify
      </button>
      <button onClick={() => setTabbarVisible(false)}>
        Hide tabbar
      </button>
      <button onClick={() => close()}>
        Close app
      </button>
    </>
  )
}
```

## Конфигурация

```js
new ExodeMiniApp({
  appId: 'my-app',          // ID приложения (обязательно)
  targetOrigin: '*',         // Origin хоста (по умолчанию '*')
  timeout: 10000,            // Таймаут handshake в мс (по умолчанию 10000)
})
```

## Типы

SDK экспортирует TypeScript-типы для строгой типизации:

```js
import {
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

# @exode-team/sdk

Exode SDK — пакет для интеграции с платформой Exode.

## Модули

| Модуль | Импорт | Назначение |
|--------|--------|------------|
| [School API](src/api/README.md) | `@exode-team/sdk/api` | Серверный клиент для Exode School API (Node.js) |
| [MiniApp](src/miniapp/README.md) | `@exode-team/sdk/miniapp` | Bridge для iframe-миниприложений |
| [MiniApp React](src/miniapp/README.md#react-хуки) | `@exode-team/sdk/miniapp/react` | React-хуки с автообновлением данных |

## Установка

```bash
npm install @exode-team/sdk
```

## Быстрый старт

### School API (Node.js)

```js
import { ExodeAPI } from '@exode-team/sdk/api'

const exodeApi = new ExodeAPI({
  sellerId: 1,
  schoolId: 1,
  token: 'your-api-token',
})

const user = await exodeApi.school.user.create({
  email: 'student@example.com',
  profile: { firstName: 'Ivan', role: 'Student' },
})
```

### MiniApp (iframe)

```js
import { ExodeMiniApp } from '@exode-team/sdk/miniapp'

const app = new ExodeMiniApp({ appId: 'my-app' })
const ctx = await app.init()

console.log(ctx.user.firstName)
```

### MiniApp React

```jsx
import { ExodeMiniAppProvider, useExodeUser, useExodeTheme } from '@exode-team/sdk/miniapp/react'

function App() {
  return (
    <ExodeMiniAppProvider config={{ appId: 'my-app' }}>
      <MyComponent />
    </ExodeMiniAppProvider>
  )
}

function MyComponent() {
  const { user, isLoggedIn } = useExodeUser()
  const { isDark } = useExodeTheme()

  return <div>Hello, {user?.firstName}</div>
}
```

### MiniApp CDN (без сборки)

```html
<script src="https://cdn.exode.biz/sdk/v0.1.0/miniapp.global.js"></script>
<script>
  const app = new ExodeMiniAppSDK.ExodeMiniApp({ appId: 'my-app' })
  app.init().then(ctx => {
    console.log(ctx.user, ctx.school, ctx.theme)
  })
</script>
```

## Требования

- Node.js >= 18.0.0 (для API модуля)
- React >= 17.0.0 (для miniapp/react, опционально)

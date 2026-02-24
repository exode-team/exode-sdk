# School API

Серверный Node.js клиент для Exode School API v2.

```bash
npm install @exode-team/sdk
```

```js
import { ExodeAPI } from '@exode-team/sdk/api'
```

## Инициализация

```js
const exodeApi = new ExodeAPI({
  sellerId: 123,
  schoolId: 456,
  token: 'your-api-token',
})
```

| Параметр | Тип | Обязательный | Описание |
|----------|-----|:------------:|----------|
| `sellerId` | `number` | да | ID продавца |
| `schoolId` | `number` | да | ID школы |
| `token` | `string` | да | API-токен |
| `baseUrl` | `string` | нет | Базовый URL API (по умолчанию `https://api.exode.biz/saas/v2`) |
| `timeout` | `number` | нет | Таймаут запроса в мс (по умолчанию `30000`) |

Все запросы автоматически включают заголовки `Seller-Id`, `School-Id`, `Authorization: Bearer {token}`.

## Методы

### User

#### Создание пользователя

```js
const user = await exodeApi.school.user.create({
  email: 'student@example.com',
  phone: '+79991234567',
  tgId: 123456789,
  extId: 'external-id-1',
  profile: {
    firstName: 'Ivan',
    lastName: 'Petrov',
    bdate: '2000-01-15',
    sex: 'Men',
    role: 'Student',
  },
})
```

#### Обновление пользователя

```js
const updated = await exodeApi.school.user.update(user.id, {
  profile: { firstName: 'Ivan Updated' },
})
```

#### Создание или обновление (upsert)

```js
const { user, isCreated } = await exodeApi.school.user.upsert({
  email: 'student@example.com',
  profile: { firstName: 'Ivan' },
})
```

#### Поиск пользователя

```js
const byEmail = await exodeApi.school.user.find({ login: 'student@example.com' })
const byTg = await exodeApi.school.user.find({ tgId: 123456789 })
const byExt = await exodeApi.school.user.find({ extId: 'external-id-1' })
```

#### Состояние пользователя (key-value)

```js
const state = await exodeApi.school.user.getState(user.id, 'PersonalInfoFilled')

await exodeApi.school.user.setState(user.id, 'PersonalInfoFilled', { filled: true })
```

#### Токен авторизации

Создаёт сессию для авто-логина через параметр `___uat`:

```js
const { session, isCreated } = await exodeApi.school.user.createAuthToken({
  userId: user.id,
})

// session.token — передайте как ?___uat=<token> в URL
```

### Group

#### Добавление участников

```js
// Макс. 100 участников за запрос
const { exist, created } = await exodeApi.school.group.addMembers(groupId, [1, 2, 3])
```

#### Удаление участников

```js
// Макс. 100 участников за запрос
const { affected } = await exodeApi.school.group.removeMembers(groupId, [1, 2])
```

### Query Export

#### Запуск экспорта

```js
import { QueryExportType, QueryExportFormat } from '@exode-team/sdk/api'

const execution = await exodeApi.school.queryExport.generate({
  type: QueryExportType.GroupMemberFindMany,
  variables: {
    filter: { groupIds: [1, 2], active: true },
    sort: { createdAt: 'DESC' },
  },
  format: QueryExportFormat.Xlsx,
})
```

#### Получение результата

Экспорт выполняется асинхронно. Используйте поллинг для получения результата:

```js
import { WorkflowExecutionStatus } from '@exode-team/sdk/api'

const result = await exodeApi.school.queryExport.getResult(execution.uuid)

if (result.status === WorkflowExecutionStatus.Completed && result.result) {
  console.log(result.result.fileUrl)
  console.log(result.result.fileName)
  console.log(result.result.fileSize)
}
```

## Обработка ошибок

```js
import { ExodeAPIError } from '@exode-team/sdk/api'

try {
  await exodeApi.school.user.find({ login: 'unknown@mail.com' })
} catch (error) {
  if (error instanceof ExodeAPIError) {
    error.code        // 400, 401, 403, 404, ...
    error.errorCause  // 'UserNotFound', 'Unauthorized', ...
    error.message     // Человекочитаемое описание
    error.details     // Техническое описание (опционально)
  }
}
```

## Типы

SDK экспортирует TypeScript-типы для всех сущностей, параметров и enums.

### Сущности

```js
import {
  // Пользователь
  UserEntity, ProfileEntity, ProfileAvatar, ProfileContact, ProfileSchool,
  // Группы
  GroupEntity, GroupMemberEntity,
  // Сессии и экспорт
  SessionEntity, WorkflowExecutionEntity, WorkflowExecutionResult,
} from '@exode-team/sdk/api'
```

### Enums

```js
import {
  Language,          // 'En', 'Ru', 'Uz', 'Qa'
  UserSex,           // 'Ufo', 'Women', 'Men'
  ProfileRole,       // 'Student', 'Tutor', 'Parent'
  UserStateKey,      // 'PersonalInfoFilled', 'UtmSignupParams', 'CustomField'
  WorkflowExecutionStatus,  // 'Waiting', 'Processing', 'Failed', 'Canceled', 'Completed'
  QueryExportType,   // GroupMemberFindMany, CourseLessonPracticeAttemptFindMany
  QueryExportFormat, // Csv, Xlsx, Json
} from '@exode-team/sdk/api'
```

### Параметры запросов

```js
import {
  UserCreateParams, UserUpdateParams, UserUpsertParams, UserFindParams,
  AuthTokenParams, QueryExportParams,
  CreateProfileParams, UpdateProfileParams,
} from '@exode-team/sdk/api'
```

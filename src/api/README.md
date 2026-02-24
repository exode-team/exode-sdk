# School API

Серверный Node.js клиент для Exode School API v2.

```bash
npm install @exode-team/sdk
```

```typescript
import { ExodeAPI } from '@exode-team/sdk/api'
```

## Инициализация

```typescript
const api = new ExodeAPI({
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

```typescript
// Создать пользователя
const user = await api.school.user.create({
  email: 'student@example.com',
  phone: '+79991234567',
  tgId: 123456789,
  extId: 'external-id-1',
  profile: {
    firstName: 'Ivan',
    lastName: 'Petrov',
    bdate: '2000-01-15',
    sex: UserSex.Men,
    role: ProfileRole.Student,
  },
})

// Обновить пользователя
const updated = await api.school.user.update(user.id, {
  profile: { firstName: 'Ivan Updated' },
})

// Создать или обновить (upsert)
const { user: upserted, isCreated } = await api.school.user.upsert({
  email: 'student@example.com',
  profile: { firstName: 'Ivan' },
})

// Найти пользователя
const found = await api.school.user.find({ login: 'student@example.com' })
const byTg = await api.school.user.find({ tgId: 123456789 })
const byExt = await api.school.user.find({ extId: 'external-id-1' })

// Состояние пользователя (key-value)
const state = await api.school.user.getState(user.id, UserStateKey.PersonalInfoFilled)
await api.school.user.setState(user.id, UserStateKey.PersonalInfoFilled, { filled: true })

// Создать токен авторизации (для авто-логина через параметр ___uat)
const { session, isCreated: sessionCreated } = await api.school.user.createAuthToken({
  userId: user.id,
})
```

### Group

```typescript
// Добавить участников в группу (макс. 100 за запрос)
const { exist, created } = await api.school.group.addMembers(groupId, [1, 2, 3])

// Удалить участников из группы (макс. 100 за запрос)
const { affected } = await api.school.group.removeMembers(groupId, [1, 2])
```

### Query Export

```typescript
import { QueryExportType, QueryExportFormat, WorkflowExecutionStatus } from '@exode-team/sdk/api'

// Запустить экспорт (асинхронно)
const execution = await api.school.queryExport.generate({
  type: QueryExportType.GroupMemberFindMany,
  variables: {
    filter: { groupIds: [1, 2], active: true },
    sort: { createdAt: 'DESC' },
  },
  format: QueryExportFormat.Xlsx,
})

// Получить результат (поллинг)
const result = await api.school.queryExport.getResult(execution.uuid)

if (result.status === WorkflowExecutionStatus.Completed && result.result) {
  console.log(result.result.fileUrl)
  console.log(result.result.fileName)
  console.log(result.result.fileSize)
}
```

## Обработка ошибок

```typescript
import { ExodeAPIError } from '@exode-team/sdk/api'

try {
  await api.school.user.find({ login: 'unknown@mail.com' })
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

### Сущности

```typescript
import type {
  UserEntity,
  ProfileEntity,
  ProfileAvatar,
  ProfileContact,
  ProfileSchool,
  GroupEntity,
  GroupMemberEntity,
  SessionEntity,
  WorkflowExecutionEntity,
  WorkflowExecutionResult,
} from '@exode-team/sdk/api'
```

### Enums

```typescript
import {
  Language,          // En, Ru, Uz, Qa
  UserSex,           // Ufo, Women, Men
  ProfileRole,       // Student, Tutor, Parent
  UserStateKey,      // PersonalInfoFilled, UtmSignupParams, CustomField
  WorkflowExecutionStatus,  // Waiting, Processing, Failed, Canceled, Completed
  QueryExportType,   // GroupMemberFindMany, CourseLessonPracticeAttemptFindMany
  QueryExportFormat, // Csv, Xlsx, Json
} from '@exode-team/sdk/api'
```

### Параметры запросов

```typescript
import type {
  UserCreateParams,
  UserUpdateParams,
  UserUpsertParams,
  UserFindParams,
  AuthTokenParams,
  QueryExportParams,
  CreateProfileParams,
  UpdateProfileParams,
} from '@exode-team/sdk/api'
```

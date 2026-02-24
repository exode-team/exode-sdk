import type { ExodeAPI } from '../client'
import type { UserEntity } from '../entities/user'
import type { SessionEntity } from '../entities/session'
import type {
  UserCreateParams,
  UserUpdateParams,
  UserUpsertParams,
  UserFindParams,
  AuthTokenParams,
  UserStateKey,
} from '../types'

export class UserMethods {

  constructor(private readonly api: ExodeAPI) {}

  async create(params: UserCreateParams): Promise<UserEntity> {
    const result = await this.api.request<{ user: UserEntity }>('POST', 'user/create', {
      body: params,
    })
    return result.user
  }

  async update(userId: number, params: UserUpdateParams): Promise<UserEntity> {
    const result = await this.api.request<{ user: UserEntity }>('PUT', `user/${userId}/update`, {
      body: params,
    })
    return result.user
  }

  async upsert(params: UserUpsertParams): Promise<{ user: UserEntity; isCreated: boolean }> {
    return this.api.request<{ user: UserEntity; isCreated: boolean }>('PUT', 'user/upsert', {
      body: params,
    })
  }

  async find(params: UserFindParams): Promise<UserEntity | null> {
    const result = await this.api.request<{ user: UserEntity | null }>('GET', 'user/find', {
      query: {
        login: params.login,
        tgId: params.tgId,
        extId: params.extId,
      },
    })
    return result.user
  }

  async getState(userId: number, key: UserStateKey): Promise<unknown> {
    const result = await this.api.request<{ value: unknown }>('GET', `user/${userId}/state/get`, {
      query: { key },
    })
    return result.value
  }

  async setState(userId: number, key: UserStateKey, value: unknown): Promise<{ set: boolean }> {
    return this.api.request<{ set: boolean }>('PUT', `user/${userId}/state/set`, {
      body: { value },
      query: { key },
    })
  }

  async createAuthToken(params: AuthTokenParams): Promise<{ session: SessionEntity; isCreated: boolean }> {
    return this.api.request<{ session: SessionEntity; isCreated: boolean }>('POST', 'user/session/auth-token', {
      body: params,
    })
  }

}

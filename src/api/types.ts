import type { UserSex, ProfileRole, UserStateKey, QueryExportType, QueryExportFormat, SortDirection } from './entities/common'

export interface ExodeAPIConfig {
  sellerId: number
  schoolId: number
  token: string
  baseUrl?: string
  timeout?: number
}

export class ExodeAPIError extends Error {

  readonly code: number
  readonly errorCause: string
  readonly details?: string

  constructor(params: { code: number; cause: string; message: string; details?: string }) {
    super(params.message)
    this.name = 'ExodeAPIError'
    this.code = params.code
    this.errorCause = params.cause
    this.details = params.details
  }

}

export interface APIErrorResponse {
  success: false
  code: number
  cause: string
  message: string
  error?: string
}

// User DTOs

export interface CreateProfileParams {
  firstName?: string | null
  lastName?: string | null
  bdate?: string | null
  sex?: UserSex | null
  role?: ProfileRole | null
  contact?: {
    phone?: string | null
    email?: string | null
    messengerUrl?: string | null
  }
}

export interface UpdateProfileParams {
  firstName?: string | null
  lastName?: string | null
  bdate?: string | null
  sex?: UserSex | null
  role?: ProfileRole | null
  contact?: {
    phone?: string | null
    email?: string | null
    messengerUrl?: string | null
  }
}

export interface UserCreateParams {
  email?: string | null
  phone?: string | null
  tgId?: number | null
  extId?: string | null
  banned?: boolean
  profile?: CreateProfileParams
}

export interface UserUpdateParams {
  email?: string | null
  phone?: string | null
  tgId?: number | null
  extId?: string | null
  banned?: boolean
  profile?: UpdateProfileParams
}

export type UserUpsertParams = UserCreateParams

export interface UserFindParams {
  login?: string
  tgId?: number
  extId?: string
}

export interface AuthTokenParams {
  userId: number
  forceCreate?: boolean
}

// Query Export DTOs

export interface QueryExportParams {
  type: QueryExportType
  variables: {
    filter: Record<string, unknown>
    sort?: Record<string, SortDirection>
  }
  format?: QueryExportFormat
}

// Re-export UserStateKey for method signatures
export type { UserStateKey }

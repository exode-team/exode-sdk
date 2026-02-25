import type { UserSex, ProfileRole } from './entities'

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

export enum Language {
  En = 'En',
  Ru = 'Ru',
  Uz = 'Uz',
  Qa = 'Qa',
}

export enum UserSex {
  Ufo = 'Ufo',
  Women = 'Women',
  Men = 'Men',
}

export enum ProfileRole {
  Student = 'Student',
  Tutor = 'Tutor',
  Parent = 'Parent',
}

export enum UserStateKey {
  CustomField = 'CustomField',
  UtmSignupParams = 'UtmSignupParams',
  PersonalInfoFilled = 'PersonalInfoFilled',
}

export interface ProfileAvatar {
  id: number
  small: string | null
  medium: string | null
  maximum: string | null
}

export interface ProfileContact {
  phone: string | null
  email: string | null
  messengerUrl: string | null
}

export interface ProfileSchool {
  id: string | null
  city: number | null
  class: string | null
  name: string | null
  speciality: string | null
}

export interface ProfileTitleState {
  manualTitle: string | null
  manualEmojiTitle: string | null
  manualNextTitle: string | null
  manualNextEmojiTitle: string | null
  manualExpiredAt: string | null
  locationTitle: string | null
  locationEmojiTitle: string | null
  achievementTitle: string | null
  achievementEmojiTitle: string | null
}

export interface ProfileEntity {
  id: number
  firstName: string | null
  lastName: string | null
  avatar: ProfileAvatar
  bdate: string | null
  sex: UserSex | null
  role: ProfileRole
  country: string | null
  city: string | null
  school: ProfileSchool
  official: boolean
  contact: ProfileContact | null
  titleState: ProfileTitleState
  createdAt: string
  updatedAt: string | null
}

export interface UserEntity {
  id: number
  uuid: string | null
  active: boolean
  activated: boolean
  banned: boolean
  domain: string | null
  email: string | null
  phone: string | null
  vkId: number | null
  tgId: number | null
  extId: string | null
  appleId: string | null
  language: Language | null
  timezone: number | null
  starsBalance: number
  lastOnlineAt: string | null
  createdAt: string
  updatedAt: string | null
  profile: ProfileEntity
}

export interface SessionEntity {
  id: number
  uuid: string
  token: string
  alive: boolean
  isOnline: boolean
  expireAt: string
  createdAt: string
  updatedAt: string | null
}

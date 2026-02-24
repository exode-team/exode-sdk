import type { UserEntity } from './user'

export interface GroupMemberTgChatMeta {
  tgChatId: string | null
  tgBotName: string | null
  chatInviteLink: string | null
  chatInviteLinkIsSentInTg: boolean | null
  tgMemberIsRemoved: boolean | null
  chatInviteLinkIsRevoked: boolean | null
}

export interface GroupEntity {
  id: number
  uuid: string
  name: string
  createdAt: string
  updatedAt: string | null
}

export interface GroupMemberEntity {
  id: number
  group: GroupEntity
  user: UserEntity
  inviter: UserEntity | null
  active: boolean
  blockedUntil: string | null
  tgChannelMeta: GroupMemberTgChatMeta
  tgGroupChatMeta: GroupMemberTgChatMeta
  createdAt: string
  updatedAt: string | null
}

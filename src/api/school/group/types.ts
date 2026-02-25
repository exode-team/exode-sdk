import type { GroupMemberEntity } from './entities'

export interface GroupMemberCreateResult {
  exist: GroupMemberEntity[]
  created: GroupMemberEntity[]
}

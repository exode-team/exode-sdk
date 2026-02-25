import type { ExodeAPI } from '../../client'
import type { GroupMemberCreateResult } from './types'

export class GroupMethods {

  constructor(private readonly api: ExodeAPI) {}

  async addMembers(groupId: number, userIds: number[]): Promise<GroupMemberCreateResult> {
    return this.api.request<GroupMemberCreateResult>('POST', `group/${groupId}/member/create-many`, {
      body: { userIds },
    })
  }

  async removeMembers(groupId: number, userIds: number[]): Promise<{ affected: number }> {
    return this.api.request<{ affected: number }>('DELETE', `group/${groupId}/member/delete-many`, {
      body: { userIds },
    })
  }

}

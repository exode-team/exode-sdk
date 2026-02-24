import type { ExodeAPI } from '../client'
import { UserMethods } from './user'
import { GroupMethods } from './group'
import { QueryExportMethods } from './query-export'

export class SchoolAPI {

  readonly user: UserMethods
  readonly group: GroupMethods
  readonly queryExport: QueryExportMethods

  constructor(api: ExodeAPI) {
    this.user = new UserMethods(api)
    this.group = new GroupMethods(api)
    this.queryExport = new QueryExportMethods(api)
  }

}

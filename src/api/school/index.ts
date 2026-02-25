import type { ExodeAPI } from '../client'
import { UserMethods } from './user/methods'
import { GroupMethods } from './group/methods'
import { QueryExportMethods } from './query-export/methods'

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

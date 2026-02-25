import type { QueryExportType, QueryExportFormat } from './entities'

export type SortDirection = 'ASC' | 'DESC'

export interface QueryExportParams {
  type: QueryExportType
  variables: {
    filter: Record<string, unknown>
    sort?: Record<string, SortDirection>
  }
  format?: QueryExportFormat
}

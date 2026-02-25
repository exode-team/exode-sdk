import type { ExodeAPI } from '../../client'
import type { WorkflowExecutionEntity, WorkflowExecutionResult } from './entities'
import type { QueryExportParams } from './types'

export class QueryExportMethods {

  constructor(private readonly api: ExodeAPI) {}

  async generate(params: QueryExportParams): Promise<WorkflowExecutionEntity> {
    return this.api.request<WorkflowExecutionEntity>('POST', 'query-export/generate', {
      body: params,
    })
  }

  async getResult(executionUuid: string): Promise<WorkflowExecutionResult> {
    return this.api.request<WorkflowExecutionResult>('GET', `workflow-execution/${executionUuid}/result`)
  }

}

import type { WorkflowExecutionStatus } from './common'

export interface WorkflowExecutionEntity {
  id: number
  uuid: string
  status: WorkflowExecutionStatus
  isCompleted: boolean
  createdAt: string
  updatedAt: string | null
}

export interface WorkflowExecutionResult {
  total: number
  completed: number
  status: WorkflowExecutionStatus
  result: WorkflowExecutionFileResult | null
}

export interface WorkflowExecutionFileResult {
  fileUrl: string
  fileName: string
  fileSize: number
}

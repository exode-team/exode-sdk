export enum WorkflowExecutionStatus {
  Waiting = 'Waiting',
  Processing = 'Processing',
  Failed = 'Failed',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export enum QueryExportType {
  GroupMemberFindMany = 'QUERY_EXPORT_TYPE_GROUP_MEMBER_FIND_MANY',
  CourseLessonPracticeAttemptFindMany = 'QUERY_EXPORT_TYPE_COURSE_LESSON_PRACTICE_ATTEMPT_FIND_MANY',
}

export enum QueryExportFormat {
  Csv = 'EXPORT_FORMAT_CSV',
  Xlsx = 'EXPORT_FORMAT_XLSX',
  Json = 'EXPORT_FORMAT_JSON',
}

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

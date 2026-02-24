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

export type SortDirection = 'ASC' | 'DESC'

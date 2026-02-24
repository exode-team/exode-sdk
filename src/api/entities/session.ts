export interface SessionEntity {
  id: number
  uuid: string
  token: string
  alive: boolean
  isOnline: boolean
  expireAt: string
  createdAt: string
  updatedAt: string | null
}

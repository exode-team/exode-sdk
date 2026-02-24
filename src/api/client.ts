import type { ExodeAPIConfig, APIErrorResponse } from './types'
import { ExodeAPIError } from './types'
import { SchoolAPI } from './school'

const DEFAULT_BASE_URL = 'https://api.exode.biz/saas/v2'
const DEFAULT_TIMEOUT = 30_000

export class ExodeAPI {

  readonly school: SchoolAPI

  private readonly baseUrl: string
  private readonly timeout: number
  private readonly headers: Record<string, string>

  constructor(config: ExodeAPIConfig) {
    if (!config.token) {
      throw new Error('ExodeAPI: token is required')
    }
    if (!config.sellerId || !config.schoolId) {
      throw new Error('ExodeAPI: sellerId and schoolId are required')
    }

    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '')
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT

    this.headers = {
      'Seller-Id': String(config.sellerId),
      'School-Id': String(config.schoolId),
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    }

    this.school = new SchoolAPI(this)
  }

  async request<T>(method: string, path: string, options?: {
    body?: unknown
    query?: Record<string, string | number | undefined>
  }): Promise<T> {
    let url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`

    if (options?.query) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          params.set(key, String(value))
        }
      }
      const qs = params.toString()
      if (qs) {
        url += `?${qs}`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    let response: Response

    try {
      response = await fetch(url, {
        method,
        headers: this.headers,
        body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      })
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ExodeAPIError({
          code: 408,
          cause: 'Timeout',
          message: `Request timed out after ${this.timeout}ms`,
        })
      }

      throw new ExodeAPIError({
        code: 0,
        cause: 'NetworkError',
        message: error instanceof Error ? error.message : 'Network request failed',
      })
    } finally {
      clearTimeout(timeoutId)
    }

    let data: unknown

    try {
      data = await response.json()
    } catch {
      throw new ExodeAPIError({
        code: response.status,
        cause: 'ParseError',
        message: `Failed to parse response as JSON (HTTP ${response.status})`,
      })
    }

    if (!response.ok) {
      const error = data as Partial<APIErrorResponse> | undefined
      throw new ExodeAPIError({
        code: error?.code ?? response.status,
        cause: error?.cause ?? 'UnknownError',
        message: error?.message ?? response.statusText,
        details: error?.error,
      })
    }

    return data as T
  }

}

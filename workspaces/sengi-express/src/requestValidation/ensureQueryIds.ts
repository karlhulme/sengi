import { csvStringToArray } from '../utils'

/**
 * Returns the requested ids.
 * @param ids An ids query string.
 */
export function ensureQueryIds (ids?: unknown): string[] {
  if (typeof ids === 'string') {
    return csvStringToArray(ids)
  } else {
    return []
  }
}

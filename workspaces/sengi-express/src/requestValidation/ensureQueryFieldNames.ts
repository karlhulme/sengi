import { csvStringToArray } from '../utils'

/**
 * Returns the requested field names.
 * @param fieldNames A field names string.
 */
export function ensureQueryFieldNames (fieldNames?: unknown): string[] {
  if (typeof fieldNames === 'string') {
    return csvStringToArray(fieldNames)
  } else {
    return []
  }
}

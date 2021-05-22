import { csvStringToArray } from '../utils'

/**
 * Converts the requested field names in CSV form, to an array of field names.
 * If no field names are supplied then id is assumed.
 * @param fieldNames A field names string.
 */
export function ensureQueryFieldNames (fieldNames?: unknown): string[] {
  const fieldNamesArray = typeof fieldNames === 'string'
    ? csvStringToArray(fieldNames)
    : []

  if (fieldNamesArray.length === 0) {
    fieldNamesArray.push('id')
  }

  return fieldNamesArray
}

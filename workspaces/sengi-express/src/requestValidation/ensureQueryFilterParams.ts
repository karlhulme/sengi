import { stringToJson } from '../utils'

/**
 * Returns the filter params or an empty object
 * if the params cannot be converted.
 * @param filterParams A filter params string.
 */
export function ensureQueryFilterParams (filterParams?: unknown): Record<string, unknown> {
  if (typeof filterParams === 'string') {
    return stringToJson(filterParams)
  } else {
    return {}
  }
}

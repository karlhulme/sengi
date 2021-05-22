import { SengiExpressMalformedFilterNameError } from '../errors'

/**
 * Returns the filter name as a string.
 * @param filterName A filter name string.
 */
export function ensureQueryFilterName (filterName?: unknown): string {
  if (typeof filterName === 'string') {
    return filterName.trim()
  } else {
    throw new SengiExpressMalformedFilterNameError
  }
}

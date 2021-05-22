import { SengiExpressMalformedFilterParamsError } from '../errors'

/**
 * Returns the filter params as a JSON object.
 * @param filterParams A filter params string.
 */
export function ensureQueryFilterParams (filterParams?: unknown): unknown {
  if (typeof filterParams === 'string' && filterParams.length > 0) {
    try {
      return JSON.parse(filterParams)
    } catch (err) {
      throw new SengiExpressMalformedFilterParamsError()
    }
  } else {
    return null
  }
}

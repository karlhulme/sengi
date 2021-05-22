import { SengiExpressMalformedQueryParamsError } from '../errors'

/**
 * Returns the query params as a JSON object.
 * @param queryParams A query params string.
 */
export function ensureQueryQueryParams (queryParams?: unknown): unknown {
  if (typeof queryParams === 'string' && queryParams.length > 0) {
    try {
      return JSON.parse(queryParams)
    } catch (err) {
      throw new SengiExpressMalformedQueryParamsError()
    }
  } else {
    return null
  }
}

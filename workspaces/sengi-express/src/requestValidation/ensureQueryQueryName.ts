import { SengiExpressMalformedQueryNameError } from '../errors'

/**
 * Returns the query name as a string.
 * @param queryName A filter name string.
 */
 export function ensureQueryQueryName (queryName?: unknown): string {
  if (typeof queryName === 'string') {
    return queryName.trim()
  } else {
    throw new SengiExpressMalformedQueryNameError()
  }
}

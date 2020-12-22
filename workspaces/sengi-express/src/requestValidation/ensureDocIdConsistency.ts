import { SengiExpressMismatchedIdsError } from '../errors'

/**
 * Raises an error if the given ids do not match.
 * @param idFromRequestBody An id taken from the request body.
 * @param idFromRequestUrlParams An id taken from the request url parameters.
 */
export function ensureDocIdConsistency (idFromRequestBody?: string, idFromRequestUrlParams?: string): void {
  if (idFromRequestBody !== idFromRequestUrlParams || typeof idFromRequestBody === 'undefined') {
    throw new SengiExpressMismatchedIdsError(idFromRequestBody, idFromRequestUrlParams)
  }
}

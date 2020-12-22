import { SengiExpressInvalidRequestId } from '../errors'

/**
 * Raises an error if the request id included in the request was an array,
 * otherwise it will return the singular request id supplied.
 * If no value was supplied, then the method will return the server request id.
 * @param serverRequestId A fallback server-generated request id.
 * @param requestId A request id sent with the request.
 */
export function ensureHeaderRequestId (serverRequestId: string, requestId?: string|string[]): string {
  if (typeof requestId === 'undefined') {
    return serverRequestId
  } else if (Array.isArray(requestId)) {
    throw new SengiExpressInvalidRequestId(requestId.join(', '))
  } else {
    return requestId
  }
}

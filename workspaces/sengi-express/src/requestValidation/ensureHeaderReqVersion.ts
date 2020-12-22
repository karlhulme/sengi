import { SengiExpressInvalidReqVersion } from '../errors'

/**
 * Raises an error if the request id included in the request was an array,
 * otherwise it will return the singular request id supplied.
 * If no value was supplied, then the method will return the server request id.
 * @param reqVersion A requested version from an express header.
 */
export function ensureHeaderReqVersion (reqVersion?: unknown): string|undefined {
  if (typeof reqVersion === 'undefined') {
    return undefined
  } else if (typeof reqVersion === 'string') {
    return reqVersion
  } else {
    throw new SengiExpressInvalidReqVersion()
  }
}

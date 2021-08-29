import { SengiExpressMalformedUserError, SengiExpressMissingUserError } from '../errors'

/**
 * Raises an error if the given api key can not be
 * JSON parsed into an object.
 * @param apiKey The value of an X-API-KEY header.
 */
export function ensureHeaderUser (user?: string|string[]): unknown {
  if (typeof user === 'string' && user.length > 0) {
    try {
      return JSON.parse(user)
    } catch (err) {
      throw new SengiExpressMalformedUserError()
    }
  } else {
    throw new SengiExpressMissingUserError()
  }
}

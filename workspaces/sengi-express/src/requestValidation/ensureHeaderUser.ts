import { SengiExpressMalformedUserError, SengiExpressMissingUserError } from '../errors'

/**
 * Raises an error if the given api key can not be converted
 * to a single string
 * @param apiKey The value of an X-API-KEY header.
 */
export function ensureHeaderUser (user?: string|string[]): string {
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

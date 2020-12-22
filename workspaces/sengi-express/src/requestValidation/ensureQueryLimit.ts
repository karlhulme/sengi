/**
 * Returns the limit as a number, or undefined, if it cannot
 * be converted.
 * @param limit A limit parameter supplied in an HTTP query string.
 */
export function ensureQueryLimit (limit?: unknown): number|undefined {
  if (typeof limit === 'string') {
    const result = Number.parseInt(limit as string)

    if (Number.isNaN(result)) {
      return undefined
    } else {
      return result
    }
  } else {
    return undefined
  }
}

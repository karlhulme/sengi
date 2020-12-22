/**
 * Returns the offset as a number, or undefined, if it cannot
 * be converted.
 * @param offset An offset parameter supplied in an HTTP query string.
 */
export function ensureQueryOffset (offset?: unknown): number|undefined {
  if (typeof offset === 'string') {
    const result = Number.parseInt(offset as string)

    if (Number.isNaN(result)) {
      return undefined
    } else {
      return result
    }
  } else {
    return undefined
  }
}

/**
 * Converts the given string to a JSON object, but if this
 * process fails then an empty object is returned.
 * @param {String} s A string.
 */
export function stringToJson (s?: string): Record<string, unknown> {
  if (typeof s === 'string' && s.length > 0) {
    try {
      return JSON.parse(s)
    } catch (err) {
      return {}
    }
  } else {
    return {}
  }
}

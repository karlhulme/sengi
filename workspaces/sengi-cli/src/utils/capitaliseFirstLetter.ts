/**
 * Returns the given string with the first character capitalised.
 * @param s The phrase to capitalise.
 */
export function capitaliseFirstLetter (s?: string): string {
  if (s && s.length > 0) {
    return s[0].toUpperCase() + s.slice(1)
  } else {
    return s || ''
  }
}

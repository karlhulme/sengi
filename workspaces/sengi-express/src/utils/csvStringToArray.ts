/**
 * Splits the given string into an array of non-zero
 * length items using a comma as the separating character.
 * This method does not support any escape values.
 * @param {String} s A string.
 */
export function csvStringToArray (s?: string): string[] {
  return typeof s === 'string'
    ? s.split(',').map(v => v.trim()).filter(v => v.length > 0)
    : []
}

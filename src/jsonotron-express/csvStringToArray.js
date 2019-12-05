/**
 * Splits the given string into an array of non-zero
 * length items using a comma as the separating character.
 * This method does not support any escape values.
 * @param {String} s A string.
 */
const csvStringToArray = s => {
  return typeof s === 'string'
    ? s.split(',').filter(v => v.length > 0)
    : []
}

module.exports = csvStringToArray

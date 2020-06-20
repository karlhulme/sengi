const check = require('check-types')

/**
 * Combines the given format validators array, keeping the custom definition
 * where there is a name-clash with the built-in format validators.
 * @param {Array} custom An array of custom format validators.
 * @param {Array} builtin An array of the built-in format validators.
 */
const combineCustomAndBuiltinFormatValidators = (custom, builtin) => {
  check.assert.array.of.object(custom)
  check.assert.array.of.object(builtin)

  const result = [...custom]

  for (let i = 0; i < builtin.length; i++) {
    const existing = result.find(ft => ft.name === builtin[i].name)

    if (!existing) {
      result.push(builtin[i])
    }
  }

  return result
}

module.exports = combineCustomAndBuiltinFormatValidators

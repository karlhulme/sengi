const check = require('check-types')

/**
 * Combines the given field type arrays, keeping the custom definition
 * where there is a name-clash with the built-in definition.
 * @param {Array} custom An array of custom field types.
 * @param {Array} builtin An array of the built-in field types.
 */
const combineCustomAndBuiltInFieldTypes = (custom, builtin) => {
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

module.exports = combineCustomAndBuiltInFieldTypes

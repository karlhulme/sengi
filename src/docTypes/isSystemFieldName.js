const check = require('check-types')
const { getSystemFieldNames } = require('jsonotron-validation')

/**
 * Returns true if the given field name is a system
 * field on the given doc type.
 * @param {Object} docType A doc type.
 * @param {String} fieldName The name of a field.
 */
const isSystemFieldName = fieldName => {
  check.assert.string(fieldName)

  return getSystemFieldNames().includes(fieldName)
}

module.exports = isSystemFieldName

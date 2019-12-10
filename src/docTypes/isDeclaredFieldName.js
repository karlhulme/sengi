const check = require('check-types')

/**
 * Returns true if the given field name is a declared
 * field on the given doc type.
 * @param {Object} docType A doc type.
 * @param {String} fieldName The name of a field.
 */
const isDeclaredFieldName = (docType, fieldName) => {
  check.assert.object(docType)
  check.assert.object(docType.fields)
  check.assert.string(fieldName)

  return typeof docType.fields[fieldName] === 'object'
}

module.exports = isDeclaredFieldName

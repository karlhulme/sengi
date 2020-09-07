import check from 'check-types'

/**
 * Returns true if the given field name is a calculated
 * field on the given doc type.
 * @param {Object} docType A doc type.
 * @param {String} fieldName The name of a field.
 */
export const isCalculatedFieldName = (docType, fieldName) => {
  check.assert.object(docType)
  check.assert.string(fieldName)

  if (typeof docType.calculatedFields === 'object') {
    return typeof docType.calculatedFields[fieldName] === 'object'
  } else {
    return false
  }
}

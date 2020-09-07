import check from 'check-types'

/**
 * Removes fields from the given doc that do not appear in the given
 * requiredFieldNames array.  However the id field is always retained.
 * @param {Object} doc A document.
 * @param {Array} requiredFieldNames An array of field names.
 */
export const removeSurplusFieldsFromDocument = (doc, requiredFieldNames) => {
  check.assert.object(doc)
  check.assert.array.of.string(requiredFieldNames)

  const fieldNames = Object.keys(doc)

  for (const fieldName of fieldNames) {
    if (fieldName !== 'id' && !requiredFieldNames.includes(fieldName)) {
      delete doc[fieldName]
    }
  }
}

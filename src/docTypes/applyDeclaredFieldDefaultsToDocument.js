import check from 'check-types'
import { isDeclaredFieldName } from './isDeclaredFieldName'

/**
 * Applies default values to the given doc, as defined on the given
 * doc type, for the fields that are required.
 * @param {Object} docType A doc type.
 * @param {Object} doc A document.
 * @param {Array} requiredFieldNames An array of field names.
 */
export const applyDeclaredFieldDefaultsToDocument = (docType, doc, requiredFieldNames) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.array.of.string(requiredFieldNames)

  for (const fieldName of requiredFieldNames) {
    if (isDeclaredFieldName(docType, fieldName)) {
      const docTypeField = docType.fields[fieldName]

      if (typeof doc[fieldName] === 'undefined' || doc[fieldName] === null) {
        if (typeof docTypeField.default === 'undefined') {
          doc[fieldName] = null
        } else {
          doc[fieldName] = docTypeField.default
        }
      }
    }
  }
}

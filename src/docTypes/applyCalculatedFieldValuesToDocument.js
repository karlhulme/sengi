const check = require('check-types')
const executeCalculatedField = require('./executeCalculatedField')
const isCalculatedFieldName = require('./isCalculatedFieldName')

/**
 * Applies calculated field values to the given doc, as defined on the given
 * doc type, for the fields that are required.  This function assumes that
 * any necessary inputs for the calculated field wlll already by present
 * on the given doc.
 * @param {Object} docType A doc type.
 * @param {Object} doc A document.
 * @param {Array} requiredFieldNames An array of field names.
 */
const applyCalculatedFieldValuesToDocument = (docType, doc, requiredFieldNames) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)
  check.assert.array.of.string(requiredFieldNames)

  for (const fieldName of requiredFieldNames) {
    if (isCalculatedFieldName(docType, fieldName)) {
      doc[fieldName] = executeCalculatedField(docType, doc, fieldName)
    }
  }
}

module.exports = applyCalculatedFieldValuesToDocument

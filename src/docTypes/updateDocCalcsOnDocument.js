const check = require('check-types')
const getCalculatedFieldNames = require('./getCalculatedFieldNames')
const executeCalculatedField = require('./executeCalculatedField')

/**
 * Update the doc calcs object on the given document by re-evaluating
 * the calculated fields.
 * @param {Object} docType A document type.
 * @param {Object} doc A doc.
 * @param {String} opId An id of the operation that caused the update of the document.
 */
const updateDocCalcsOnDocument = (docType, doc) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.object(doc.docCalcs)

  const calculatedFieldNames = getCalculatedFieldNames(docType)

  doc.docCalcs = {}

  for (const calculatedFieldName of calculatedFieldNames) {
    doc.docCalcs[calculatedFieldName] = {
      value: executeCalculatedField(docType, doc, calculatedFieldName)
    }
  }
}

module.exports = updateDocCalcsOnDocument

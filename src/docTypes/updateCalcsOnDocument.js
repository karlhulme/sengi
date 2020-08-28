const check = require('check-types')
const executeCalculatedField = require('./executeCalculatedField')

/**
 * Update the system calcs object on the given document by re-evaluating
 * the calculated fields.
 * @param {Object} docType A document type.
 * @param {Object} doc A doc.
 * @param {String} opId An id of the operation that caused the update of the document.
 */
const updateCalcsOnDocument = (docType, doc) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.object(doc.docHeader)

  doc.docHeader.calcs = {}

  for (const calculatedFieldName in docType.calculatedFields) {
    doc.docHeader.calcs[calculatedFieldName] = {
      value: executeCalculatedField(docType, doc, calculatedFieldName)
    }
  }
}

module.exports = updateCalcsOnDocument

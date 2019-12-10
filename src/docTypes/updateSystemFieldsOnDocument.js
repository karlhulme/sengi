const check = require('check-types')
const getMaxOpsSize = require('./getMaxOpsSize')

/**
 * Updates the system fields (docOps) on the given document.
 * @param {Object} docType A document type.
 * @param {Object} doc A doc.
 * @param {String} opId An id of the operation that caused the update of the document.
 */
const updateSystemFieldsOnDocument = (docType, doc, opId) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.array.of.string(doc.docOps)
  check.assert.string(opId)

  const maxOpsSize = getMaxOpsSize(docType)

  while (doc.docOps.length >= maxOpsSize) {
    doc.docOps.splice(0, 1)
  }

  doc.docOps.push(opId)
}

module.exports = updateSystemFieldsOnDocument

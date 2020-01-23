const check = require('check-types')

/**
 * Applies the system fields (id, docType docOps and docCalcs) to the given new document.
 * @param {Object} docType A doc type.
 * @param {Object} doc A doc.
 * @param {String} id A new id that conforms to the docId field type.
 */
const applySystemFieldValuesToNewDocument = (docType, doc, id) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)
  check.assert.string(id)

  doc.id = id
  doc.docType = docType.name
  doc.docOps = []
  doc.docCalcs = {}
}

module.exports = applySystemFieldValuesToNewDocument

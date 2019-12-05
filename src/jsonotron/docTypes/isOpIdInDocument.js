const check = require('check-types')

/**
 * Returns true if the given operation id exists in
 * the array of processed operation ids on the given document.
 * @param {Object} doc A document.
 * @param {String} opId The id of an operation.
 */
const isOpIdInDocument = (doc, opId) => {
  check.assert.object(doc)
  check.assert.array.of.string(doc.docOps)
  check.assert.string(opId)

  return doc.docOps.includes(opId)
}

module.exports = isOpIdInDocument

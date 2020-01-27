const check = require('check-types')

/**
 * Returns true if the given operation id exists in
 * the array of processed operation ids on the given document.
 * @param {Object} doc A document.
 * @param {String} opId The id of an operation.
 */
const isOpIdInDocument = (doc, opId) => {
  check.assert.object(doc)
  check.assert.object(doc.sys)
  check.assert.array.of.object(doc.sys.ops)
  check.assert.string(opId)

  return doc.sys.ops.findIndex(op => op.opId === opId) > -1
}

module.exports = isOpIdInDocument

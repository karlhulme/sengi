import check from 'check-types'

/**
 * Returns true if the given operation id exists in
 * the array of processed operation ids on the given document.
 * @param {Object} doc A document.
 * @param {String} opId The id of an operation.
 */
export const isOpIdInDocument = (doc, opId) => {
  check.assert.object(doc)
  check.assert.object(doc.docHeader)
  check.assert.array.of.object(doc.docHeader.ops)
  check.assert.string(opId)

  return doc.docHeader.ops.findIndex(op => op.opId === opId) > -1
}

import check from 'check-types'

/**
 * Update the system properties 'updated' and 'ops' on the given document.
 * @param {Object} docType A document type.
 * @param {Object} doc A doc.
 * @param {String} opId An id of the operation that caused the update of the document.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A date time string that conforms to the UtcDateTime type.
 * @param {String} style A value of either 'operation' or 'patch'.
 * @param {String} [operationName] The name of an operation, if the style was 'operation'.
 */
export const applySystemFieldValuesToUpdatedDocument = (docType, doc, opId, userIdentity, dateTime, style, operationName) => {
  check.assert.object(docType)
  check.assert.object(docType.policy)
  check.assert.integer(docType.policy.maxOpsSize)
  check.assert.object(doc)
  check.assert.object(doc.docHeader)
  check.assert.array.of.object(doc.docHeader.ops)
  check.assert.string(opId)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)
  check.assert.string(style)
  check.assert.maybe.string(operationName)

  doc.docHeader.updated = {
    userIdentity,
    dateTime
  }

  while (doc.docHeader.ops.length >= docType.policy.maxOpsSize) {
    doc.docHeader.ops.splice(0, 1)
  }

  const op = {
    opId,
    userIdentity,
    dateTime,
    style
  }

  if (style === 'operation' && operationName) {
    op.operationName = operationName
  }

  doc.docHeader.ops.push(op)
}

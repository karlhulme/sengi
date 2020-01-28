const check = require('check-types')
const getMaxOpsSize = require('./getMaxOpsSize')

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
const applySystemFieldValuesToUpdatedDocument = (docType, doc, opId, userIdentity, dateTime, style, operationName) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.object(doc.sys)
  check.assert.array.of.object(doc.sys.ops)
  check.assert.string(opId)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)
  check.assert.string(style)
  check.assert.maybe.string(operationName)

  doc.sys.updated = {
    userIdentity,
    dateTime
  }

  const maxOpsSize = getMaxOpsSize(docType)

  while (doc.sys.ops.length >= maxOpsSize) {
    doc.sys.ops.splice(0, 1)
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

  doc.sys.ops.push(op)
}

module.exports = applySystemFieldValuesToUpdatedDocument

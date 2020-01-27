const check = require('check-types')
const getMaxOpsSize = require('./getMaxOpsSize')

/**
 * Updates the system ops field on the given document.
 * @param {Object} docType A document type.
 * @param {Object} doc A doc.
 * @param {String} opId An id of the operation that caused the update of the document.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A date time string that conforms to the UtcDateTime type.
 */
const updateOpsOnDocument = (docType, doc, opId, userIdentity, dateTime) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.object(doc.sys)
  check.assert.array.of.object(doc.sys.ops)
  check.assert.string(opId)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)

  const maxOpsSize = getMaxOpsSize(docType)

  while (doc.sys.ops.length >= maxOpsSize) {
    doc.sys.ops.splice(0, 1)
  }

  doc.sys.ops.push({
    opId,
    userIdentity,
    dateTime
  })
}

module.exports = updateOpsOnDocument

const check = require('check-types')

/**
 * Adds the system fields id, docType and the sys object to the given document.
 * @param {Object} docType A doc type.
 * @param {Object} doc A doc.
 * @param {String} id A new id that conforms to the sysId field type.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A date time string that conforms to the UtcDateTime type.
 */
const addSystemFieldValuesToNewDocument = (docType, doc, id, userIdentity, dateTime) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)
  check.assert.string(id)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)

  doc.id = id
  doc.docType = docType.name
  doc.docHeader = {
    origin: {
      style: 'new',
      userIdentity,
      dateTime
    },
    updated: {
      userIdentity,
      dateTime
    },
    ops: [],
    calcs: {}
  }
}

module.exports = addSystemFieldValuesToNewDocument

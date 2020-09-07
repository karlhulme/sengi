import check from 'check-types'

/**
 * Adds the system fields id, docType and the docHeader object to the given document.
 * @param {Object} docType A doc type.
 * @param {Object} doc A doc.
 * @param {String} id A new id that conforms to the uuid schema type.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A date time string that conforms to the UtcDateTime type.
 */
export const addSystemFieldValuesToNewDocument = (docType, doc, id, userIdentity, dateTime) => {
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

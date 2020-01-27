const check = require('check-types')

/**
 * Appends an origin and updated property to the given document.
 * @param {Object} doc A doc.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A date time string that conforms to the UtcDateTime type.
 */
const applySystemFieldValuesToReplacedDocument = (doc, userIdentity, dateTime) => {
  check.assert.object(doc)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)

  if (typeof doc.sys !== 'object' || doc.sys === null || Array.isArray(doc.sys)) {
    doc.sys = {}
  }

  if (typeof doc.sys.origin !== 'object' || doc.sys.origin === null || Array.isArray(doc.sys.origin)) {
    doc.sys.origin = {
      style: 'replace',
      userIdentity,
      dateTime
    }
  }

  doc.sys.updated = {
    userIdentity,
    dateTime
  }
}

module.exports = applySystemFieldValuesToReplacedDocument

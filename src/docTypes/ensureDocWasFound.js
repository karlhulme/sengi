const check = require('check-types')
const { JsonotronDocumentNotFoundError } = require('jsonotron-errors')

/**
 * Raises an error if the given doc is not an object.
 * @param {String} docTypeName A doc type name.
 * @param {String} id The id of the document that was searched for.
 * @param {Object} doc The document object that was returned.
 */
const ensureDocWasFound = (docTypeName, id, doc) => {
  check.assert.string(docTypeName)
  check.assert.string(id)

  if (typeof doc !== 'object' || Array.isArray(doc) || doc === null) {
    throw new JsonotronDocumentNotFoundError(docTypeName, id)
  }
}

module.exports = ensureDocWasFound

const check = require('check-types')
const { JsonotronUnrecognisedDocTypeNameError } = require('jsonotron-errors')

/**
 * Selects the doc type with the given name from the given docTypes array.
 * @param {Array} docTypes An array of doc types.
 * @param {String} docTypeName The name of a doc type.
 */
const selectDocTypeFromArray = (docTypes, docTypeName) => {
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)

  const docType = docTypes.find(dt => dt.name === docTypeName)

  if (!docType) {
    throw new JsonotronUnrecognisedDocTypeNameError(docTypeName)
  }

  return docType
}

module.exports = selectDocTypeFromArray

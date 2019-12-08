const check = require('check-types')
const { JsonotronUnrecognisedDocTypePluralNameError } = require('../errors')

const resolveDocTypeNameFromPlural = ({ docTypes, docTypePluralName }) => {
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypePluralName)

  const docType = docTypes.find(dt => docTypePluralName.localeCompare(dt.pluralName) === 0)

  if (!docType) {
    throw new JsonotronUnrecognisedDocTypePluralNameError(docTypePluralName)
  }

  return docType.name
}

module.exports = resolveDocTypeNameFromPlural

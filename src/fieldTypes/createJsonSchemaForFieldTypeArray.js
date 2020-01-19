const check = require('check-types')
const { JsonotronFieldTypeResolutionError } = require('../errors')
const getJsonSchemaFragmentForFieldType = require('./getJsonSchemaFragmentForFieldType')
const getReferencedFieldTypeNames = require('./getReferencedFieldTypeNames')

/**
 * Creates a JSON Schema for the given field type array.
 * @param {Array} fieldTypes An array of field types.
 * @param {String} fieldTypeName The name of a field type.
 */
const createJsonSchemaForFieldTypeArray = (fieldTypes, fieldTypeName) => {
  check.assert.array.of.object(fieldTypes)
  check.assert.string(fieldTypeName)

  const fieldType = fieldTypes.find(ft => ft.name === fieldTypeName)

  if (typeof fieldType !== 'object' || fieldType === null) {
    throw new JsonotronFieldTypeResolutionError(fieldTypeName)
  }

  const refFieldTypeNames = getReferencedFieldTypeNames(fieldTypes, fieldType.referencedFieldTypes || [])

  return {
    title: `${fieldType.title} Array JSON Schema`,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    items: {
      ...getJsonSchemaFragmentForFieldType(fieldType)
    },
    definitions: refFieldTypeNames.reduce((acc, cur) => {
      const refFieldType = fieldTypes.find(ft => ft.name === cur)

      acc[cur] = getJsonSchemaFragmentForFieldType(refFieldType)

      return acc
    }, {})
  }
}

module.exports = createJsonSchemaForFieldTypeArray

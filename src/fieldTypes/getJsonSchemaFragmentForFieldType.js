const check = require('check-types')
const { JsonotronInternalError } = require('../errors')

/**
 * Returns the JSON schema fragment of the given field type.
 * This will be the local fragment only, it will not include
 * any referenced dependencies.
 * An enum field type will have a 'values' array property
 * whereas schema backed field types will not.
 * @param {Object} fieldType A field type.
 */
const getJsonSchemaFragmentForFieldType = fieldType => {
  check.assert.object(fieldType)

  if (Array.isArray(fieldType.values)) {
    return { enum: fieldType.values.map(v => v.value) }
  } else if (typeof fieldType.jsonSchema === 'object') {
    return fieldType.jsonSchema
  } else {
    throw new JsonotronInternalError('Expected \'fieldType\' to declare a \'values\' array property or a \'jsonSchema\' property.')
  }
}

module.exports = getJsonSchemaFragmentForFieldType

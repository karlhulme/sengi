/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const { getJsonSchemaFragmentForFieldType } = require('../fieldTypes')
const createJsonSchemaForDocTypeMergePatch = require('./createJsonSchemaForDocTypeMergePatch')

const docType = {
  name: 'map',
  title: 'Map',
  fields: {
    cost: { type: 'money', isRequired: true, canUpdate: true, description: 'The cost of the map.' },
    sizeInMetresSquares: { type: 'integer', description: 'The size of the map.' },
    placesCount: { type: 'integer', description: 'The number of places covered.' },
    list: { type: 'integer', isArray: true, description: 'A list of numbers.' },
    neighbouringMapId: { ref: 'map', canUpdate: true, description: 'The id of a neighbouring map.' },
    vendors: { type: 'string', isArray: true, canUpdate: true, description: 'A list of vendors.' }
  }
}

const getJsonSchemaFragmentForFieldName = fieldTypeName => {
  const fieldType = builtinFieldTypes.find(ft => ft.name === fieldTypeName)
  return getJsonSchemaFragmentForFieldType(fieldType)
}

test('Build an Update JSON Schema for doc type fields.', () => {
  expect(createJsonSchemaForDocTypeMergePatch(docType, builtinFieldTypes)).toEqual({
    title: 'Map "Merge Patch" JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties: {
      cost: { $ref: '#/definitions/money', description: 'The cost of the map.' },
      neighbouringMapId: { $ref: '#/definitions/sysId', description: 'The id of a neighbouring map.' },
      vendors: {
        type: 'array',
        description: 'A list of vendors.',
        items: {
          $ref: '#/definitions/string'
        }
      }
    },
    definitions: {
      currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
      sysId: getJsonSchemaFragmentForFieldName('sysId'),
      integer: getJsonSchemaFragmentForFieldName('integer'),
      money: getJsonSchemaFragmentForFieldName('money'),
      string: getJsonSchemaFragmentForFieldName('string')
    }
  })
})

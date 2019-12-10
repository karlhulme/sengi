/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const { getJsonSchemaFragmentForFieldType } = require('../fieldTypes')
const createJsonSchemaForDocTypeFields = require('./createJsonSchemaForDocTypeFields')

const docType = {
  name: 'map',
  title: 'Map',
  fields: {
    cost: { type: 'money', isRequired: true, description: 'The cost of the map.' },
    sizeInMetresSquares: { type: 'integer', description: 'The size of the map.' },
    placesCount: { type: 'integer', description: 'The number of places covered.' },
    list: { type: 'integer', isArray: true, description: 'A list of numbers.' },
    neighbouringMapId: { ref: 'map', description: 'The id of a neighbouring map.' }
  }
}

const getJsonSchemaFragmentForFieldName = fieldTypeName => {
  const fieldType = builtinFieldTypes.find(ft => ft.name === fieldTypeName)
  return getJsonSchemaFragmentForFieldType(fieldType)
}

test('Build a JSON Schema for doc type fields.', () => {
  expect(createJsonSchemaForDocTypeFields(docType, builtinFieldTypes)).toEqual({
    title: 'Map JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { $ref: '#/definitions/docId', description: 'The id of the document.' },
      docType: { enum: ['map'], description: 'The type of the document.' },
      docVersion: { $ref: '#/definitions/docVersion', description: 'The version of the current iteration of the document (eTag).' },
      docOps: { type: 'array', items: { $ref: '#/definitions/docOpId' }, description: 'The id\'s of recent operations on the document.' },
      cost: { $ref: '#/definitions/money', description: 'The cost of the map.' },
      sizeInMetresSquares: { $ref: '#/definitions/integer', description: 'The size of the map.' },
      placesCount: { $ref: '#/definitions/integer', description: 'The number of places covered.' },
      list: { type: 'array', items: { $ref: '#/definitions/integer' }, description: 'A list of numbers.' },
      neighbouringMapId: { $ref: '#/definitions/docId', description: 'The id of a neighbouring map.' }
    },
    required: ['id', 'docType', 'docOps', 'cost'],
    definitions: {
      currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
      docId: getJsonSchemaFragmentForFieldName('docId'),
      docVersion: getJsonSchemaFragmentForFieldName('docVersion'),
      docOpId: getJsonSchemaFragmentForFieldName('docOpId'),
      integer: getJsonSchemaFragmentForFieldName('integer'),
      money: getJsonSchemaFragmentForFieldName('money')
    }
  })
})

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
      docVersion: { description: 'The version of the current iteration of the document (eTag) that is re-generated on save.' },
      sys: {
        type: 'object',
        properties: {
          origin: {
            type: 'object',
            description: 'An object that describes the creation of the document.',
            additionalProperties: false,
            properties: {
              style: { enum: ['new', 'replace'] },
              userIdentity: { $ref: '#/definitions/docUserIdentity', description: 'The identity of the user that created the document.' },
              dateTime: { $ref: '#/definitions/docDateTime', description: 'The moment that the document was created.' }
            },
            required: ['style', 'userIdentity', 'dateTime']
          },
          ops: {
            type: 'array',
            items: {
              type: 'object',
              description: 'An object that describes an operation.',
              properties: {
                opId: { $ref: '#/definitions/docOpId', description: 'The id of an operation.' },
                userIdentity: { $ref: '#/definitions/docUserIdentity', description: 'The identity of the user that initiated the operation.' },
                dateTime: { $ref: '#/definitions/docDateTime', description: 'The moment that the operation took place.' }
              },
              additionalProperties: false,
              required: ['opId', 'userIdentity', 'dateTime']
            },
            description: 'The id\'s of recent operations on the document.'
          },
          calcs: {
            type: 'object',
            description: 'An object that contains calculated field values as determined at the last update.',
            additionalProperties: {
              type: 'object',
              description: 'Represents a single calculated field.',
              additionalProperties: false,
              properties: {
                value: { description: 'The last known value of the calculated field.' }
              }
            }
          }
        },
        required: ['ops', 'calcs']
      },
      cost: { $ref: '#/definitions/money', description: 'The cost of the map.' },
      sizeInMetresSquares: { $ref: '#/definitions/integer', description: 'The size of the map.' },
      placesCount: { $ref: '#/definitions/integer', description: 'The number of places covered.' },
      list: { type: 'array', items: { $ref: '#/definitions/integer' }, description: 'A list of numbers.' },
      neighbouringMapId: { $ref: '#/definitions/docId', description: 'The id of a neighbouring map.' }
    },
    required: ['id', 'docType', 'sys', 'cost'],
    definitions: {
      currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
      docDateTime: getJsonSchemaFragmentForFieldName('docDateTime'),
      docId: getJsonSchemaFragmentForFieldName('docId'),
      docUserIdentity: getJsonSchemaFragmentForFieldName('docUserIdentity'),
      docVersion: getJsonSchemaFragmentForFieldName('docVersion'),
      docOpId: getJsonSchemaFragmentForFieldName('docOpId'),
      integer: getJsonSchemaFragmentForFieldName('integer'),
      money: getJsonSchemaFragmentForFieldName('money')
    }
  })
})

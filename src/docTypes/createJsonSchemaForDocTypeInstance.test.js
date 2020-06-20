/* eslint-env jest */
const { builtinFieldTypes } = require('jsonotron-fields')
const { getJsonSchemaFragmentForFieldType } = require('../fieldTypes')
const createJsonSchemaForDocTypeInstance = require('./createJsonSchemaForDocTypeInstance')

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
  expect(createJsonSchemaForDocTypeInstance(docType, builtinFieldTypes)).toEqual({
    title: 'Map JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { $ref: '#/definitions/sysId', description: 'The id of the document.' },
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
              style: { enum: ['new', 'replace'], description: 'A value of \'new\' if the document was created using the constructor, otherwise \'replace\'.' },
              userIdentity: { $ref: '#/definitions/sysUserIdentity', description: 'The identity of the user that created the document.' },
              dateTime: { $ref: '#/definitions/sysDateTime', description: 'The moment that the document was created.' }
            },
            required: ['style', 'userIdentity', 'dateTime']
          },
          updated: {
            type: 'object',
            description: 'An object that describes the last time the document was updated.',
            additionalProperties: false,
            properties: {
              userIdentity: { $ref: '#/definitions/sysUserIdentity', description: 'The identity of the user that last updated the document.' },
              dateTime: { $ref: '#/definitions/sysDateTime', description: 'The moment that the document was last updated.' }
            },
            required: ['userIdentity', 'dateTime']
          },
          ops: {
            type: 'array',
            items: {
              type: 'object',
              description: 'An object that describes an operation.',
              properties: {
                opId: { $ref: '#/definitions/sysOpId', description: 'The id of an operation.' },
                userIdentity: { $ref: '#/definitions/sysUserIdentity', description: 'The identity of the user that initiated the operation.' },
                dateTime: { $ref: '#/definitions/sysDateTime', description: 'The moment that the operation took place.' },
                style: { enum: ['patch', 'operation'], description: 'The style of the update, either \'patch\' or \'operation\'.' },
                operationName: { type: 'string', description: 'The name of the operation, if style is \'operation\'' }
              },
              additionalProperties: false,
              required: ['opId', 'userIdentity', 'dateTime', 'style']
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
      neighbouringMapId: { $ref: '#/definitions/sysId', description: 'The id of a neighbouring map.' }
    },
    required: ['id', 'docType', 'sys', 'cost'],
    definitions: {
      currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
      sysDateTime: getJsonSchemaFragmentForFieldName('sysDateTime'),
      sysId: getJsonSchemaFragmentForFieldName('sysId'),
      sysUserIdentity: getJsonSchemaFragmentForFieldName('sysUserIdentity'),
      sysVersion: getJsonSchemaFragmentForFieldName('sysVersion'),
      sysOpId: getJsonSchemaFragmentForFieldName('sysOpId'),
      integer: getJsonSchemaFragmentForFieldName('integer'),
      money: getJsonSchemaFragmentForFieldName('money')
    }
  })
})

test('Build a JSON Schema for doc type fields to be used as a fragment with external schemas.', () => {
  expect(createJsonSchemaForDocTypeInstance(docType, builtinFieldTypes, true, '#/components/schemas/')).toEqual({
    title: 'Map JSON Schema',
    type: 'object',
    additionalProperties: true,
    properties: {
      id: { $ref: '#/components/schemas/sysId', description: 'The id of the document.' },
      docType: { enum: ['map'], description: 'The type of the document.' },
      docVersion: { description: 'The version of the current iteration of the document (eTag) that is re-generated on save.' },
      sys: expect.anything(),
      cost: { $ref: '#/components/schemas/money', description: 'The cost of the map.' },
      sizeInMetresSquares: { $ref: '#/components/schemas/integer', description: 'The size of the map.' },
      placesCount: { $ref: '#/components/schemas/integer', description: 'The number of places covered.' },
      list: { type: 'array', items: { $ref: '#/components/schemas/integer' }, description: 'A list of numbers.' },
      neighbouringMapId: { $ref: '#/components/schemas/sysId', description: 'The id of a neighbouring map.' }
    },
    required: ['id', 'docType', 'sys', 'cost']
  })
})

/* eslint-env jest */
const createJsonSchemaForFieldType = require('./createJsonSchemaForFieldType')
const { JsonotronFieldTypeResolutionError } = require('../errors')

const fieldTypes = [{
  name: 'example',
  title: 'Example',
  jsonSchema: {
    type: 'object',
    properties: {
      first: { $ref: '#/definitions/integer' },
      second: { $ref: '#/definitions/integer' }
    },
    required: ['first', 'second']
  },
  referencedFieldTypes: ['integer']
}, {
  name: 'integer',
  title: 'Integer',
  jsonSchema: {
    type: 'number'
  }
}, {
  name: 'film',
  title: 'Film',
  jsonSchema: {
    type: 'object',
    properties: {
      star: { $ref: '#/definitions/unresolved' }
    }
  },
  referencedFieldTypes: ['unresolved']
}]

test('Build a JSON Schema for a field with no dependencies.', () => {
  expect(createJsonSchemaForFieldType(fieldTypes, 'integer')).toEqual({
    title: 'Integer JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'number',
    definitions: {}
  })
})

test('Build a JSON Schema for a field with referenced field types.', () => {
  expect(createJsonSchemaForFieldType(fieldTypes, 'example')).toEqual({
    title: 'Example JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      first: { $ref: '#/definitions/integer' },
      second: { $ref: '#/definitions/integer' }
    },
    required: ['first', 'second'],
    definitions: {
      integer: { type: 'number' }
    }
  })
})

test('Fail to build a JSON Schema for an invalid field type.', () => {
  expect(() => createJsonSchemaForFieldType(fieldTypes, 'invalid')).toThrow(JsonotronFieldTypeResolutionError)
  expect(() => createJsonSchemaForFieldType(fieldTypes, 'invalid')).toThrow(/Field type 'invalid' cannot be resolved/)
})

test('Fail to build a JSON Schema for a type with an unresolved reference.', () => {
  expect(() => createJsonSchemaForFieldType(fieldTypes, 'film')).toThrow(JsonotronFieldTypeResolutionError)
  expect(() => createJsonSchemaForFieldType(fieldTypes, 'film')).toThrow(/Field type 'unresolved' cannot be resolved/)
})

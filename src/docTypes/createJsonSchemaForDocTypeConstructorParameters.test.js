/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const createJsonSchemaForDocTypeConstructorParameters = require('./createJsonSchemaForDocTypeConstructorParameters')

const docType = {
  name: 'candidate',
  title: 'Candidate',
  fields: {},
  ctor: {
    parameters: {
      amount: { type: 'money', isRequired: true, description: 'The money.' },
      event: { type: 'dateTimeUtc', description: 'The event.' }
    }
  }
}

test('Build a JSON Schema for doc type constructor parameters.', () => {
  expect(createJsonSchemaForDocTypeConstructorParameters(docType, builtinFieldTypes)).toEqual({
    title: 'Candidate "Constructor" JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties: {
      amount: { $ref: '#/definitions/money', description: 'The money.' },
      event: { $ref: '#/definitions/dateTimeUtc', description: 'The event.' }
    },
    required: ['amount'],
    definitions: {
      currencyCode: expect.anything(),
      dateTimeUtc: expect.anything(),
      integer: expect.anything(),
      money: expect.anything()
    }
  })
})

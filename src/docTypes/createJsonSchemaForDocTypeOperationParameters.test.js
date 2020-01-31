/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const createJsonSchemaForDocTypeOperationParameters = require('./createJsonSchemaForDocTypeOperationParameters')

const docType = {
  name: 'candidate',
  title: 'Candidate',
  fields: {},
  operations: {
    doSomething: {
      parameters: {
        amount: { type: 'money', isRequired: true, description: 'The money.' },
        event: { type: 'dateTimeUtc', description: 'The event.' }
      }
    }
  }
}

test('Build a JSON Schema for doc type operation parameters.', () => {
  expect(createJsonSchemaForDocTypeOperationParameters(docType, 'doSomething', builtinFieldTypes)).toEqual({
    title: 'Candidate "Operation doSomething" JSON Schema',
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

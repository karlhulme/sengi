/* eslint-env jest */
const { JsonotronUnrecognisedDocTypePluralNameError } = require('../errors')
const { createTestRequest } = require('./shared.test')
const resolveDocTypeNameFromPlural = require('./resolveDocTypeNameFromPlural')

test('Resolve a document type plural name to a singular name.', () => {
  expect(resolveDocTypeNameFromPlural({
    ...createTestRequest(),
    docTypePluralName: 'persons'
  })).toEqual('person')
})

test('Fail to resolve a document type plural name with incorrect casing to a singular name.', () => {
  expect(() => resolveDocTypeNameFromPlural({
    ...createTestRequest(),
    docTypePluralName: 'perSONs'
  })).toThrow(JsonotronUnrecognisedDocTypePluralNameError)
})

test('Fail to resolve an invalid document type plural name.', () => {
  expect(() => resolveDocTypeNameFromPlural({
    ...createTestRequest(),
    docTypePluralName: 'invalid'
  })).toThrow(/not defined/)
})

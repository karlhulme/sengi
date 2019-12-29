/* eslint-env jest */
const ensureOperationName = require('./ensureOperationName')
const { JsonotronUnrecognisedOperationNameError } = require('../errors')

const docType = {
  name: 'testDocType',
  operations: {
    doSomethingA: {},
    doSomethingB: {}
  }
}

const docTypeWithNoOperations = {
  name: 'testDocType'
}

test('Accept recognised operation names.', () => {
  expect(() => ensureOperationName(docType, 'doSomethingA')).not.toThrow()
  expect(() => ensureOperationName(docType, 'doSomethingB')).not.toThrow()
})

test('Reject unrecognised operation names.', () => {
  expect(() => ensureOperationName(docType, 'invalidOpName')).toThrow(JsonotronUnrecognisedOperationNameError)
  expect(() => ensureOperationName(docTypeWithNoOperations, 'invalidOpName')).toThrow(JsonotronUnrecognisedOperationNameError)
})

/* eslint-env jest */
import { ensureOperationName } from './ensureOperationName'
import { SengiUnrecognisedOperationNameError } from '../errors'

const docType = {
  name: 'testDocType',
  operations: {
    doSomethingA: {},
    doSomethingB: {}
  }
}

test('Accept recognised operation names.', () => {
  expect(() => ensureOperationName(docType, 'doSomethingA')).not.toThrow()
  expect(() => ensureOperationName(docType, 'doSomethingB')).not.toThrow()
})

test('Reject unrecognised operation names.', () => {
  expect(() => ensureOperationName(docType, 'invalidOpName')).toThrow(SengiUnrecognisedOperationNameError)
})

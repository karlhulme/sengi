/* eslint-env jest */
import { executeValidator } from './executeValidator'
import { SengiDocumentCustomValidationError } from '../errors'

const docTypeWithNoValidate = {
  name: 'testDocType2'
}

const docType = {
  name: 'testDocType',
  validate: doc => {
    if (doc.isValid !== true) {
      throw new Error('Valid was not set to true')
    }
  }
}

test('Executing a doc type validator where no validate function is defined raises no error.', () => {
  expect(() => executeValidator(docTypeWithNoValidate, {})).not.toThrow()
})

test('Executing a doc type validator on a valid doc raises no error.', () => {
  expect(() => executeValidator(docType, { isValid: true })).not.toThrow()
})

test('Executing a doc type validator on an invalid doc raises an error.', () => {
  expect(() => executeValidator(docType, { isValid: false })).toThrow(SengiDocumentCustomValidationError)
  expect(() => executeValidator(docType, { isValid: false })).toThrow(/Valid was not set to true/)
})

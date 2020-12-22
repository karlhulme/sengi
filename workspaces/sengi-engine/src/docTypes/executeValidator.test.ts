import { expect, test } from '@jest/globals'
import { DocType, SengiDocTypeValidateFunctionError } from 'sengi-interfaces'
import { executeValidator } from './executeValidator'
import { createCarDocType } from './shared.test'

function createDocTypeWithoutValidator (): DocType {
  const docType = createCarDocType()
  delete docType.validate
  return docType
}

function createDocTypeWithValidator (): DocType {
  const docType = createCarDocType()
  docType.validate = () => { 1 + 1 }
  return docType
}

function createDocTypeWithErroringValidator (): DocType {
  const docType = createCarDocType()
  docType.validate = () => { throw new Error('bespoke problem') }
  return docType
}

test('Executing a validator against valid data raises no errors.', () => {
  expect(() => executeValidator(createDocTypeWithValidator(), {})).not.toThrow()
})

test('Executing a validator function on a doc type that does not define one raises no errors.', () => {
  expect(() => executeValidator(createDocTypeWithoutValidator(), {})).not.toThrow()
})

test('Executing a validator function that raises errors will be wrapped.', () => {
  try {
    executeValidator(createDocTypeWithErroringValidator(), {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocTypeValidateFunctionError)
    expect(err.message).toContain('The validate function defined for document type \'car\' raised an error')
    expect(err.message).toContain('bespoke problem')
  }
})

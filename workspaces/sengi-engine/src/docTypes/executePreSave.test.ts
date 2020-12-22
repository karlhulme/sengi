import { expect, test } from '@jest/globals'
import { DocType, SengiPreSaveFailedError } from 'sengi-interfaces'
import { executePreSave } from './executePreSave'
import { createCarDocType } from './shared.test'

function createDocTypeWithoutPreSave (): DocType {
  const docType = createCarDocType()
  delete docType.preSave
  return docType
}

function createDocTypeWithPreSave (): DocType {
  const docType = createCarDocType()
  docType.preSave = () => { 1 + 1 }
  return docType
}

function createDocTypeWithFaultyPreSave (): DocType {
  const docType = createCarDocType()
  docType.preSave = () => { throw new Error('bad') }
  return docType
}

test('Executing a valid pre-save function raises no errors.', () => {
  expect(() => executePreSave(createDocTypeWithPreSave(), {})).not.toThrow()
})

test('Executing a pre-save function on a doc type that does not define one raises no errors.', () => {
  expect(() => executePreSave(createDocTypeWithoutPreSave(), {})).not.toThrow()
})

test('Executing a pre-save function that raises errors will be wrapped.', () => {
  try {
    executePreSave(createDocTypeWithFaultyPreSave(), {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPreSaveFailedError)
    expect(err.message).toMatch('Error: bad')
  }
})

import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedOperationNameError } from 'sengi-interfaces'
import { ensureOperationName } from './ensureOperationName'
import { createFilmDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createFilmDocType()
  
  docType.operations = {
    someOp: {
      title: 'Some Operation',
      documentation: '',
      parameters: {},
      examples: [],
      implementation: () => ({})
    }
  }

  return docType
}

test('Accept recognised operation names.', () => {
  expect(() => ensureOperationName(createDocType(), 'someOp')).not.toThrow()
})

test('Reject unrecognised filter names.', () => {
  try {
    ensureOperationName(createDocType(), 'invalidOp')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedOperationNameError)
    expect(err.operationName).toEqual('invalidOp')
  }
})

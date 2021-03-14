import { expect, test } from '@jest/globals'
import { DocFragment, DocType, SengiOperationParamsValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureOperationParams } from './ensureOperationParams'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.operations = {
    doSomething: {
      parameters: {
        runLengthInSeconds: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: '' }
      },
      documentation: '',
      examples: [],
      implementation: () => ({}),
      title: ''
    }
  }

  return docType
}

test('Valid doc type operation params are accepted.', () => {
  const operationParams: DocFragment = { runLengthInSeconds: 1000, ignored: '123' }
  const cache = {}
  expect(() => ensureOperationParams(createJsonotron(), cache, createDocType(), 'doSomething', operationParams)).not.toThrow()
  expect(cache).toHaveProperty(['[film].operations[doSomething].parameters'])
  expect(() => ensureOperationParams(createJsonotron(), cache, createDocType(), 'doSomething', operationParams)).not.toThrow()
})

test('Unrecognised operations will accept any set of parameters.', () => {
  const operationParams: DocFragment = { runLengthInSeconds: 1000, ignored: '123' }
  expect(() => ensureOperationParams(createJsonotron(), {}, createDocType(), 'madeup', operationParams)).not.toThrow()
})

test('Invalid doc type operation params are rejected.', () => {
  try {
    const operationParams: DocFragment = { runLengthInSeconds: 'wrong-type' }
    ensureOperationParams(createJsonotron(), {}, createDocType(), 'doSomething', operationParams)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiOperationParamsValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

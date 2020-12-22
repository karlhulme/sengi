import { expect, test } from '@jest/globals'
import {
  DocType, Doc, DocFragment,
  SengiOperationFailedError,
  SengiOperationNonObjectResponseError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'
import { executeOperation } from './executeOperation'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.operations = {
    doSomething: {
      title: '',
      documentation: '',
      examples: [],
      parameters: {
        propA: { type: 'string', documentation: '' },
        propB: { type: 'string', documentation: '' }
      },
      implementation: (doc: Doc, input: DocFragment) => {
        return {
          result: (input.propA as string) + (input.propB as string)
        }
      }
    },
    broken: {
      title: '',
      documentation: '',
      examples: [],
      parameters: {},
      implementation: () => { throw new Error('fail') }
    },
    stringErrorResponse: {
      title: '',
      documentation: '',
      examples: [],
      parameters: {},
      implementation: () => 'error'
    }
  }

  return docType
}

test('Executing a doc type operation with valid parameters returns the operation result.', () => {
  expect(executeOperation(createDocType(), {}, 'doSomething', { propA: 'hello', propB: 'world' })).toEqual({ result: 'helloworld' })
})

test('Executing an unrecognised doc type operation raises an error.', () => {
  try {
    executeOperation(createDocType(), {}, 'madeup', { propA: 'hello', propB: 'world' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedOperationNameError)
    expect(err.message).toMatch(/madeup/)
  }
})

test('Executing an operation that does not return a merge patch raises an error.', () => {
  try {
    executeOperation(createDocType(), {}, 'stringErrorResponse', {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiOperationNonObjectResponseError)
    expect(err.message).toMatch(/failed to return an object/)
  }
})

test('Executing an operation that raises an error causes that error to be passed on.', () => {
  try {
    executeOperation(createDocType(), {}, 'broken', {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiOperationFailedError)
    expect(err.message).toMatch(/Error: fail/)
  }
})

/* eslint-env jest */
const {
  JsonotronInternalError,
  JsonotronOperationFailedError,
  JsonotronOperationNonObjectResponseError,
  JsonotronUnrecognisedOperationNameError
} = require('jsonotron-errors')
const executeOperation = require('./executeOperation')

const docType = {
  name: 'example',
  fields: {
    result: {}
  },
  operations: {
    doSomething: {
      parameters: {
        propA: { type: 'string' },
        propB: { type: 'string' }
      },
      implementation: (doc, input) => {
        return {
          result: input.propA + input.propB
        }
      }
    },
    broken: {
      parameters: {},
      implementation: (doc, input) => { throw new Error('fail') }
    },
    noImplementation: {
      parameters: {}
    },
    stringErrorResponse: {
      parameters: {},
      implementation: () => 'error'
    },
    nullErrorResponse: {
      parameters: {},
      implementation: () => null
    }
  }
}

const docTypeWithNoOperations = {
  name: 'example2'
}

test('Executing a doc type operation with valid parameters returns the operation result.', () => {
  const doc = {}
  expect(executeOperation(docType, doc, 'doSomething', { propA: 'hello', propB: 'world' })).toEqual({ result: 'helloworld' })
})

test('Executing an unrecognised doc type operation raises an error.', () => {
  expect(() => executeOperation(docType, {}, 'madeup', { propA: 'hello', propB: null })).toThrow(JsonotronUnrecognisedOperationNameError)
  expect(() => executeOperation(docTypeWithNoOperations, {}, 'madeup', { propA: 'hello', propB: null })).toThrow(/madeup/)
})

test('Executing an operation with no implementation raises an error.', () => {
  expect(() => executeOperation(docType, {}, 'noImplementation', {})).toThrow(JsonotronInternalError)
})

test('Executing an operation that does not return a merge patch raises an error.', () => {
  expect(() => executeOperation(docType, {}, 'stringErrorResponse', {})).toThrow(JsonotronOperationNonObjectResponseError)
  expect(() => executeOperation(docType, {}, 'nullErrorResponse', {})).toThrow(/failed to return an object/)
})

test('Executing an operation that raises an error causes that error to be passed on.', () => {
  expect(() => executeOperation(docType, {}, 'broken', {})).toThrow(JsonotronOperationFailedError)
  expect(() => executeOperation(docType, {}, 'broken', {})).toThrow(/Error: fail/)
})

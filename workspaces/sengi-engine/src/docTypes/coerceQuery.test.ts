import { expect, test } from '@jest/globals'
import {
  DocBase, DocType,
  SengiUnrecognisedQueryNameError,
  SengiQueryResponseValidationFailedError,
  SengiQueryCoerceFailedError
} from 'sengi-interfaces'
import { asError } from '../utils'
import { createValidator } from './shared.test'
import { coerceQuery } from './coerceQuery'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleResult {
  queryResultA: string
}

const exampleQueryResponseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    queryResponseA: { type: 'number' }
  },
  required: ['queryResponseA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, ExampleResult> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    queries: {
      count: {
        parametersJsonSchema: {},
        parse: () => ({}),
        responseJsonSchema: exampleQueryResponseSchema,
        coerce: queryResult => {
          if (queryResult.queryResultA === 'break') {
            throw new Error('break')
          }

          if (queryResult.queryResultA === 'invalid') {
            return 'wrong_shape'
          }

          return { queryResponseA: 123 }
        }
      }
    }
  }

  return docType
}

test('Coerce query result into response.', () => {
  expect(coerceQuery(createValidator(), createDocType(), 'count', { queryResultA: 'good' })).toEqual({ queryResponseA: 123 })
})

test('Reject coercion of query result for an unrecognised name.', () => {
  expect(() => coerceQuery(createValidator(), createDocType(), 'unrecognised', { queryResultA: 'good' })).toThrow(asError(SengiUnrecognisedQueryNameError))
})

test('Reject coercion of query result if no queries defined.', () => {
  const docType = createDocType()
  delete docType.queries
  expect(() => coerceQuery(createValidator(), docType, 'unrecognised', { queryResultA: 'good' })).toThrow(asError(SengiUnrecognisedQueryNameError))
})

test('Reject coercion of query result if query coercion raises errors.', () => {
  expect(() => coerceQuery(createValidator(), createDocType(), 'count', { queryResultA: 'break' })).toThrow(asError(SengiQueryCoerceFailedError))
})

test('Reject coercion of query result if returned value does not match schema.', () => {
  expect(() => coerceQuery(createValidator(), createDocType(), 'count', { queryResultA: 'invalid' })).toThrow(asError(SengiQueryResponseValidationFailedError))
})

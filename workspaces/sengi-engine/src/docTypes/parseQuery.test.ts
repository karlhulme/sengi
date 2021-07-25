import { expect, test } from '@jest/globals'
import {
  DocBase, DocType,
  SengiUnrecognisedQueryNameError,
  SengiQueryParamsValidationFailedError,
  SengiQueryParseFailedError,
  DocTypeQuery
} from 'sengi-interfaces'
import { asError } from '../utils'
import { createValidator } from './shared.test'
import { parseQuery } from './parseQuery'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleQueryParams {
  queryPropA: string
}

type ExampleQuery = string

const exampleQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    queryPropA: { type: 'string' }
  },
  required: ['queryPropA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, ExampleQuery, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    queries: {
      count: {
        parametersJsonSchema: exampleQuerySchema,
        parse: props => {
          if (props.parameters.queryPropA === 'fail') {
            throw new Error('fail')
          }

          return props.parameters.queryPropA + 'Query'
        },
        responseJsonSchema: {},
        coerce: () => ({})
      } as DocTypeQuery<unknown, unknown, ExampleQueryParams, unknown, ExampleQuery>
    }
  }

  return docType
}

test('Produce query object from valid query params.', () => {
  expect(parseQuery(createValidator(), createDocType(), null, 'count', { queryPropA: 'abc' })).toEqual('abcQuery')
})

test('Reject production of query object for an unrecognised name.', () => {
  expect(() => parseQuery(createValidator(), createDocType(), null, 'unrecognised', { queryPropA: 'abc' })).toThrow(asError(SengiUnrecognisedQueryNameError))
})

test('Reject production of query object if no queries defined.', () => {
  const docType = createDocType()
  delete docType.queries
  expect(() => parseQuery(createValidator(), docType, null, 'unrecognised', { queryPropA: 'abc' })).toThrow(asError(SengiUnrecognisedQueryNameError))
})

test('Reject production of query object using invalid parameters.', () => {
  expect(() => parseQuery(createValidator(), createDocType(), null, 'count', { queryPropA: 123 })).toThrow(asError(SengiQueryParamsValidationFailedError))
})

test('Reject production of query object if operation raises error.', () => {
  expect(() => parseQuery(createValidator(), createDocType(), null, 'count', { queryPropA: 'fail' })).toThrow(asError(SengiQueryParseFailedError))
})

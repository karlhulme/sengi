import { expect, test } from '@jest/globals'
import {
  DocBase, DocType,
  SengiFilterParseFailedError,
  SengiFilterParamsValidationFailedError,
  SengiUnrecognisedFilterNameError
} from 'sengi-interfaces'
import { asError } from '../utils'
import { createValidator } from './shared.test'
import { parseFilter } from './parseFilter'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleFilterParams {
  filterPropA: string
}

type ExampleFilter = string

const exampleFilterSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    filterPropA: { type: 'string' }
  },
  required: ['filterPropA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, ExampleFilter, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    filters: {
      byPropA: {
        parametersJsonSchema: exampleFilterSchema,
        parse: (params: ExampleFilterParams) => {
          if (params.filterPropA === 'fail') {
            throw new Error('fail')
          }

          return params.filterPropA + 'Filter'
        }
      }
    }
  }

  return docType
}

test('Produce filter object from valid filter params.', () => {
  expect(parseFilter(createValidator(), createDocType(), 'byPropA', { filterPropA: 'abc' })).toEqual('abcFilter')
})

test('Reject production of filter object for an unrecognised name.', () => {
  expect(() => parseFilter(createValidator(), createDocType(), 'unrecognised', { filterPropA: 'abc' })).toThrow(asError(SengiUnrecognisedFilterNameError))
})

test('Reject production of filter object if no filters defined.', () => {
  const docType = createDocType()
  delete docType.filters
  expect(() => parseFilter(createValidator(), docType, 'unrecognised', { filterPropA: 'abc' })).toThrow(asError(SengiUnrecognisedFilterNameError))
})

test('Reject production of filter object using invalid parameters.', () => {
  expect(() => parseFilter(createValidator(), createDocType(), 'byPropA', { filterPropA: 123 })).toThrow(asError(SengiFilterParamsValidationFailedError))
})

test('Reject production of filter object if operation raises error.', () => {
  expect(() => parseFilter(createValidator(), createDocType(), 'byPropA', { filterPropA: 'fail' })).toThrow(asError(SengiFilterParseFailedError))
})

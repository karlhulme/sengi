import { expect, test } from '@jest/globals'
import {
  DocBase, DocType,
  SengiFilterFailedError,
  SengiFilterParamsValidationFailedError,
  SengiUnrecognisedFilterNameError
} from 'sengi-interfaces'
import { asError, createValidator } from './shared.test'
import { executeFilter } from './executeFilter'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleFilterParams {
  opPropA: string
}

const exampleFilterSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    opPropA: { type: 'string' }
  },
  required: ['opPropA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    filters: {
      byPropA: {
        parametersJsonSchema: exampleFilterSchema,
        parse: (params: ExampleFilterParams) => {
          if (params.opPropA === 'fail') {
            throw new Error('fail')
          }

          return params.opPropA + 'Filter'
        }
      }
    }
  }

  return docType
}

test('Produce filter object from valid filter params.', () => {
  expect(executeFilter(createValidator(), createDocType(), 'byPropA', { opPropA: 'abc' })).toEqual('abcFilter')
})

test('Reject production of filter object for an unrecognised name.', () => {
  expect(() => executeFilter(createValidator(), createDocType(), 'unrecognised', { opPropA: 'abc' })).toThrow(asError(SengiUnrecognisedFilterNameError))
})

test('Reject production of filter object if no filters defined.', () => {
  const docType = createDocType()
  delete docType.filters
  expect(() => executeFilter(createValidator(), docType, 'unrecognised', { opPropA: 'abc' })).toThrow(asError(SengiUnrecognisedFilterNameError))
})

test('Reject production of filter object using invalid parameters.', () => {
  expect(() => executeFilter(createValidator(), createDocType(), 'byPropA', { opPropA: 123 })).toThrow(asError(SengiFilterParamsValidationFailedError))
})

test('Reject production of filter object if operation raises error.', () => {
  expect(() => executeFilter(createValidator(), createDocType(), 'byPropA', { opPropA: 'fail' })).toThrow(asError(SengiFilterFailedError))
})

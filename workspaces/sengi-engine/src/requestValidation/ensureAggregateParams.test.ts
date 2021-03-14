import { expect, test } from '@jest/globals'
import { DocFragment, DocType, SengiAggregateParamsValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureAggregateParams } from './ensureAggregateParams'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.aggregates = {
    documentCount: {
      parameters: {
        propA: { type: 'https://jsonotron.org/jsl/shortString', documentation: '' }
      },
      fields: {
        documentCount: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: '' }
      },
      documentation: '',
      examples: [],
      implementation: () => ({}),
      title: ''
    }
  }

  return docType
}

test('Valid doc type aggregate params are accepted.', () => {
  const aggregateParams: DocFragment = { propA: 'TOTAL', ignored: '123' }
  const cache = {}
  expect(() => ensureAggregateParams(createJsonotron(), cache, createDocType(), 'documentCount', aggregateParams)).not.toThrow()
  expect(cache).toHaveProperty(['[film].aggregates[documentCount].parameters'])
  expect(() => ensureAggregateParams(createJsonotron(), cache, createDocType(), 'documentCount', aggregateParams)).not.toThrow()
})

test('Unrecognised filters will accept any set of parameters.', () => {
  const aggregateParams: DocFragment = { propA: 1000, ignored: '123' }
  expect(() => ensureAggregateParams(createJsonotron(), {}, createDocType(), 'madeup', aggregateParams)).not.toThrow()
})

test('Invalid doc type filter params are rejected.', () => {
  try {
    const aggregateParams: DocFragment = { propA: 123 }
    ensureAggregateParams(createJsonotron(), {}, createDocType(), 'documentCount', aggregateParams)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiAggregateParamsValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

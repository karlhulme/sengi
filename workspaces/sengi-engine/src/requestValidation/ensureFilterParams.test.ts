import { expect, test } from '@jest/globals'
import { DocFragment, DocType, SengiFilterParamsValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureFilterParams } from './ensureFilterParams'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.filters = {
    byRuntime: {
      parameters: {
        runLengthInSeconds: { type: 'positiveInteger', documentation: '' }
      },
      documentation: '',
      examples: [],
      implementation: () => ({}),
      title: ''
    }
  }

  return docType
}

test('Valid doc type filter params are accepted.', () => {
  const filterParams: DocFragment = { runLengthInSeconds: 1000, ignored: '123' }
  const cache = {}
  expect(() => ensureFilterParams(createJsonotron(), cache, createDocType(), 'byRuntime', filterParams)).not.toThrow()
  expect(cache).toHaveProperty(['[film].filters[byRuntime].parameters'])
  expect(() => ensureFilterParams(createJsonotron(), cache, createDocType(), 'byRuntime', filterParams)).not.toThrow()
})

test('Unrecognised filters will accept any set of parameters.', () => {
  const filterParams: DocFragment = { runLengthInSeconds: 1000, ignored: '123' }
  expect(() => ensureFilterParams(createJsonotron(), {}, createDocType(), 'madeup', filterParams)).not.toThrow()
})

test('Invalid doc type filter params are rejected.', () => {
  try {
    const filterParams: DocFragment = { runLengthInSeconds: 'wrong-type' }
    ensureFilterParams(createJsonotron(), {}, createDocType(), 'byRuntime', filterParams)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiFilterParamsValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

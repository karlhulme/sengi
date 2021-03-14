import { expect, test } from '@jest/globals'
import { DocFragment, DocType, SengiCtorParamsValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureConstructorParams } from './ensureConstructorParams'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.ctor.parameters = {
    runLengthInSeconds: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: '' }
  }

  docType.fields = {
    movieName: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, canUpdate: true, documentation: '' },
    rating: { type: 'https://jsonotron.org/jsl/shortString', documentation: '', default: 'Unrated' },
    publisher: { type: 'https://jsonotron.org/jsl/shortString', documentation: '', mustInitialise: true }
  }

  return docType
}

test('Valid doc type ctor params are accepted using both constructor parameters and updateable regular fields.', () => {
  const ctorParams: DocFragment = { movieName: 'jaws', runLengthInSeconds: 6480, publisher: 'Paramount' }
  const cache = {}
  expect(() => ensureConstructorParams(createJsonotron(), cache, createDocType(), ctorParams)).not.toThrow()
  expect(cache).toHaveProperty(['[film].ctor.parameters'])
  expect(() => ensureConstructorParams(createJsonotron(), cache, createDocType(), ctorParams)).not.toThrow()
})

test('Invalid doc type ctor params are rejected.', () => {
  try {
    const ctorParams: DocFragment = { movieName: 123, rating: '15' }
    ensureConstructorParams(createJsonotron(), {}, createDocType(), ctorParams)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCtorParamsValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

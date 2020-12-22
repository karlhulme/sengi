import { expect, test } from '@jest/globals'
import { DocFragment, DocType, SengiCtorParamsValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureConstructorParams } from './ensureConstructorParams'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.ctor.parameters = {
    runLengthInSeconds: { type: 'positiveInteger', documentation: '' }
  }

  docType.fields = {
    movieName: { type: 'shortString', isRequired: true, canUpdate: true, documentation: '' },
    rating: { type: 'shortString', documentation: '', default: 'Unrated' }
  }

  return docType
}

test('Valid doc type ctor params are accepted using both constructor parameters and updateable regular fields.', () => {
  const ctorParams: DocFragment = { movieName: 'jaws', runLengthInSeconds: 6480 }
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

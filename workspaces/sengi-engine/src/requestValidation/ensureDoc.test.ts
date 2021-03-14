import { expect, test } from '@jest/globals'
import { Doc, DocType, SengiDocValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensureDoc } from './ensureDoc'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.fields = {
    movieName: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, canUpdate: true, documentation: '' },
    directorName: { type: 'https://jsonotron.org/jsl/shortString', canUpdate: true, documentation: '' },
    actorNames: { type: 'https://jsonotron.org/jsl/mediumString', canUpdate: true, isArray: true, documentation: '' },
    runLength: { type: 'https://jsonotron.org/jsl/positiveInteger', canUpdate: true, documentation: '', deprecation: 'Do not judge a film by length' },
    rating: { type: 'https://jsonotron.org/jsl/shortString', canUpdate: true, documentation: '', default: 'Unrated' }
  }

  docType.calculatedFields = {
    actorCount: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: '', inputFields: ['actorNames'], value: input => (input.actorNames as [] || []).length }
  }

  return docType
}

test('Valid doc type fields are accepted.', () => {
  const doc: Doc = { movieName: 'jaws', directorName: 'Stephen Spielberg', actorNames: ['Roy Scheider', 'Richard Dreyfuss'], runLength: 108, rating: '12', actorCount: 2 }
  const cache = {}
  expect(() => ensureDoc(createJsonotron(), cache, createDocType(), doc)).not.toThrow()
  expect(cache).toHaveProperty(['[film].fields'])
  expect(() => ensureDoc(createJsonotron(), cache, createDocType(), doc)).not.toThrow()
})

test('Invalid doc type fields are rejected.', () => {
  try {
    const doc: Doc = { movieName: 123, directorName: 'Stephen Spielberg', actorNames: ['Roy Scheider', 'Richard Dreyfuss'], runLength: 108, rating: '12', actorCount: 2 }
    ensureDoc(createJsonotron(), {}, createDocType(), doc)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

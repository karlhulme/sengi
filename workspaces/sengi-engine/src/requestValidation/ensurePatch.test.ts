import { expect, test } from '@jest/globals'
import { DocPatch, DocType, SengiPatchValidationFailedError } from 'sengi-interfaces'
import { createFilmDocType, createJsonotron } from './shared.test'
import { ensurePatch } from './ensurePatch'

function createDocType (): DocType {
  const docType = createFilmDocType()

  docType.fields = {
    movieName: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, canUpdate: true, documentation: '' },
    rating: { type: 'https://jsonotron.org/jsl/shortString', documentation: '', default: 'Unrated' }
  }

  docType.calculatedFields = {
    actorCount: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: '', inputFields: ['actorNames'], value: input => (input.actorNames as [] || []).length }
  }

  return docType
}

test('Valid change patch is accepted.', () => {
  const patch: DocPatch = { movieName: 'jaws' }
  const cache = {}
  expect(() => ensurePatch(createJsonotron(), cache, createDocType(), patch)).not.toThrow()
  expect(cache).toHaveProperty(['[film].patch'])
  expect(() => ensurePatch(createJsonotron(), cache, createDocType(), patch)).not.toThrow()
})

test('Patches with a field value of an invalid type is rejected.', () => {
  try {
    const patch: DocPatch = { movieName: 123 }
    ensurePatch(createJsonotron(), {}, createDocType(), patch)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

test('Patches to a system field is rejected.', () => {
  try {
    const patch: DocPatch = { docType: 'new_value' }
    ensurePatch(createJsonotron(), {}, createDocType(), patch)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

test('Patches to a non-updateable field is rejected.', () => {
  try {
    const patch: DocPatch = { rating: '12' }
    ensurePatch(createJsonotron(), {}, createDocType(), patch)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

test('Patches to a calculated field is rejected.', () => {
  try {
    const patch: DocPatch = { actorCount: '2' }
    ensurePatch(createJsonotron(), {}, createDocType(), patch)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(err).toHaveProperty('errors')
  }
})

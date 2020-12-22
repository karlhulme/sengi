import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedDocTypeNameError } from 'sengi-interfaces'
import { selectDocTypeFromArray } from './selectDocTypeFromArray'
import { createFilmDocType } from './shared.test'

function createDocTypes (): DocType[] {
  const docTypes = [
    createFilmDocType(),
    createFilmDocType()
  ]

  docTypes[0].name = 'jaws'
  docTypes[1].name = 'alien'

  return docTypes
}

test('Find valid doc types by name', () => {
  const docTypes = createDocTypes()
  expect(selectDocTypeFromArray(docTypes, 'jaws')).toEqual(docTypes[0])
  expect(selectDocTypeFromArray(docTypes, 'alien')).toEqual(docTypes[1])
})

test('Fail to find invalid doc types by name.', () => {
  try {
    selectDocTypeFromArray(createDocTypes(), 'madeup')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedDocTypeNameError)
    expect(err.message).toMatch(/not defined/)
  }
})

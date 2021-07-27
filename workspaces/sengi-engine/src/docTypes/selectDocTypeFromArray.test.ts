import { expect, test } from '@jest/globals'
import { SengiUnrecognisedDocTypeNameError, AnyDocType } from 'sengi-interfaces'
import { selectDocTypeFromArray } from './selectDocTypeFromArray'

function createDocTypes () {
  const docTypes: AnyDocType[] = [{
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {}
  }, {
    name: 'example',
    pluralName: 'examples',
    jsonSchema: {}
  }]

  return docTypes
}

test('Find valid doc types by name', () => {
  const docTypes = createDocTypes()
  expect(selectDocTypeFromArray(docTypes, 'test')).toEqual(docTypes[0])
  expect(selectDocTypeFromArray(docTypes, 'example')).toEqual(docTypes[1])
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

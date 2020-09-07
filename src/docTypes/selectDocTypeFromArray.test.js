/* eslint-env jest */
import { SengiUnrecognisedDocTypeNameError } from '../errors'
import { selectDocTypeFromArray } from './selectDocTypeFromArray'

const docTypes = [
  { name: 'docTypeA' },
  { name: 'docTypeB' }
]

test('Find valid doc types by name', () => {
  expect(selectDocTypeFromArray(docTypes, 'docTypeA')).toEqual(docTypes[0])
  expect(selectDocTypeFromArray(docTypes, 'docTypeB')).toEqual(docTypes[1])
})

test('Fail to find invalid doc types by name.', () => {
  expect(() => selectDocTypeFromArray(docTypes, 'madeup')).toThrow(SengiUnrecognisedDocTypeNameError)
  expect(() => selectDocTypeFromArray(docTypes, 'madeup')).toThrow(/not defined/)
})

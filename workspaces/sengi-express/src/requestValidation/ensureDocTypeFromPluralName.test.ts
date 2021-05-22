import { test, expect } from '@jest/globals'
import { AnyDocType } from 'sengi-interfaces'
import { ensureDocTypeFromPluralName } from './ensureDocTypeFromPluralName'
import { SengiExpressUnrecognisedDocTypePluralNameError } from '../errors'

const docTypes: AnyDocType[] = [{
  name: 'red',
  pluralName: 'reds',
  jsonSchema: {}
}, {
  name: 'blue',
  pluralName: 'blues',
  jsonSchema: {}
}]

test('Ensure doc type name is valid by returning the singular from the plural.', () => {
  expect(ensureDocTypeFromPluralName(docTypes, 'reds')).toEqual(docTypes[0])
})

test('Raise an error if doc type name is not valid.', () => {
  try {
    ensureDocTypeFromPluralName(docTypes, 'greens')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressUnrecognisedDocTypePluralNameError)
  }
})

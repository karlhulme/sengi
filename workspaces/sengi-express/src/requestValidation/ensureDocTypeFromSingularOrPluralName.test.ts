import { test, expect } from '@jest/globals'
import { AnyDocType } from 'sengi-interfaces'
import { ensureDocTypeFromSingularOrPluralName } from './ensureDocTypeFromSingularOrPluralName'
import { SengiExpressUnrecognisedDocTypeNameError } from '../errors'

const docTypes: AnyDocType[] = [{
  name: 'red',
  pluralName: 'reds',
  jsonSchema: {}
}, {
  name: 'blue',
  pluralName: 'blues',
  jsonSchema: {}
}]

test('Find a doc type based on the singular doc type name.', () => {
  expect(ensureDocTypeFromSingularOrPluralName(docTypes, 'red')).toEqual(docTypes[0])
})

test('Find a doc type based on the plural doc type name.', () => {
  expect(ensureDocTypeFromSingularOrPluralName(docTypes, 'reds')).toEqual(docTypes[0])
})


test('Raise an error if doc type name is not valid.', () => {
  try {
    ensureDocTypeFromSingularOrPluralName(docTypes, 'greens')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressUnrecognisedDocTypeNameError)
  }
})

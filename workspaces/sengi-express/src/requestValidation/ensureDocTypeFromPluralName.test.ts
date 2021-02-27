import { test, expect } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { ensureDocTypeFromPluralName } from './ensureDocTypeFromPluralName'
import { SengiExpressUnrecognisedDocTypePluralNameError } from '../errors'

const docTypes: DocType[] = [{
  name: 'red',
  pluralName: 'reds',
  title: '',
  pluralTitle: '',
  summary: '',
  documentation: '',
  examples: [],
  aggregates: {},
  calculatedFields: {},
  docStoreOptions: {},
  fields: {},
  filters: {},
  operations: {},
  policy: {
    canDeleteDocuments: false,
    canFetchWholeCollection: false,
    canReplaceDocuments: false,
    maxOpsSize: 5
  },
  ctor: {
    title: '',
    documentation: '',
    examples: [],
    parameters: {},
    implementation: () => ({})
  }
}, {
  name: 'blue',
  pluralName: 'blues',
  title: '',
  pluralTitle: '',
  summary: '',
  documentation: '',
  examples: [],
  aggregates: {},
  calculatedFields: {},
  docStoreOptions: {},
  fields: {},
  filters: {},
  operations: {},
  policy: {
    canDeleteDocuments: false,
    canFetchWholeCollection: false,
    canReplaceDocuments: false,
    maxOpsSize: 5
  },
  ctor: {
    title: '',
    documentation: '',
    examples: [],
    parameters: {},
    implementation: () => ({})
  }
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

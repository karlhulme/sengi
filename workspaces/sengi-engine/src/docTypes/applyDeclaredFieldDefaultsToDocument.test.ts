import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { applyDeclaredFieldDefaultsToDocument } from './applyDeclaredFieldDefaultsToDocument'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.fields = {
    propA: { type: 'string', default: 'hello', documentation: '' },
    propB: { type: 'string', default: 'world', documentation: '' },
    propC: { type: 'string', documentation: '' },
    propD: { type: 'string', documentation: '' }
  }

  return docType
}

test('Apply default values to an empty document for a set of fields.', () => {
  const doc = {}
  applyDeclaredFieldDefaultsToDocument(createDocType(), doc, ['propA', 'propC'])
  expect(doc).toEqual({ propA: 'hello' })
})

test('Apply default values to a partially populated document, filling empty values but not overwriting existing ones.', () => {
  const doc = { propA: 'set' }
  applyDeclaredFieldDefaultsToDocument(createDocType(), doc, ['propA', 'propB', 'propC'])
  expect(doc).toEqual({ propA: 'set', propB: 'world' })
})

test('Apply default values ignoring unrecognised field names.', () => {
  const doc = {}
  applyDeclaredFieldDefaultsToDocument(createDocType(), {}, ['madeup'])
  expect(doc).toEqual({})
})

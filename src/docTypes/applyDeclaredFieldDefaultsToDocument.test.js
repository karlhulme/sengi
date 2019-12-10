/* eslint-env jest */
const applyDeclaredFieldDefaultsToDocument = require('./applyDeclaredFieldDefaultsToDocument')

const docType = {
  fields: {
    propA: { default: 'hello' },
    propB: { default: 'world' },
    propC: {},
    propD: {}
  }
}

test('Apply default values to an empty document.', () => {
  const doc = {}
  applyDeclaredFieldDefaultsToDocument(docType, doc, ['propA', 'propC'])
  expect(doc).toEqual({ propA: 'hello', propC: null })
})

test('Apply default values to a partially populated document.', () => {
  const doc = { propA: 'set' }
  applyDeclaredFieldDefaultsToDocument(docType, doc, ['propA', 'propB', 'propC'])
  expect(doc).toEqual({ propA: 'set', propB: 'world', propC: null })
})

test('Apply default values ignoring unrecognised field names.', () => {
  const doc = {}
  applyDeclaredFieldDefaultsToDocument(docType, {}, ['madeup'])
  expect(doc).toEqual({})
})

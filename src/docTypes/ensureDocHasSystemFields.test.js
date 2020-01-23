/* eslint-env jest */
const ensureDocHasSystemFields = require('./ensureDocHasSystemFields')

test('Accept a document that has all the system fields.', () => {
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docType: 'bbb', docOps: [] })).not.toThrow()
})

test('Reject a document that is missing an id field.', () => {
  expect(() => ensureDocHasSystemFields({ docType: 'bbb', docOps: [] })).toThrow(/id/)
})

test('Reject a document that is missing an id field.', () => {
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docOps: [] })).toThrow(/docType/)
})

test('Append a docOps system property to a document to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', docCalcs: {} }
  expect(() => ensureDocHasSystemFields(doc)).not.toThrow()
  expect(doc).toHaveProperty('docOps', [])
})

test('Append a docCalcs system property to a document to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', docOps: [] }
  expect(() => ensureDocHasSystemFields(doc)).not.toThrow()
  expect(doc).toHaveProperty('docCalcs', {})
})

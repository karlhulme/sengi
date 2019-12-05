/* eslint-env jest */
const ensureDocHasSystemFields = require('./ensureDocHasSystemFields')

test('Accept a document that has the system fields.', () => {
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docType: 'bbb', docVersion: 'ccc', docOps: [] })).not.toThrow()
})

test('Reject a document that is missing system fields.', () => {
  expect(() => ensureDocHasSystemFields({ docType: 'bbb', docVersion: 'ccc', docOps: [] })).toThrow(/id/)
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docVersion: 'ccc', docOps: [] })).toThrow(/docType/)
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docType: 'bbb', docOps: [] })).toThrow(/docVersion/)
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docType: 'bbb', docVersion: 'ccc' })).toThrow(/docOps/)
})

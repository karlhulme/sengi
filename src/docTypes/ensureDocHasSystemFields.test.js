/* eslint-env jest */
const ensureDocHasSystemFields = require('./ensureDocHasSystemFields')

test('Accept a document that has all the system fields.', () => {
  expect(() => ensureDocHasSystemFields({ id: 'aaa', docType: 'bbb' })).not.toThrow()
})

test('Reject a document that is missing an id field.', () => {
  expect(() => ensureDocHasSystemFields({ docType: 'bbb' })).toThrow(/id/)
})

test('Reject a document that is missing an id field.', () => {
  expect(() => ensureDocHasSystemFields({ id: 'aaa' })).toThrow(/docType/)
})

test('Append a missing sys object to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb' }
  expect(() => ensureDocHasSystemFields(doc)).not.toThrow()
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('ops', [])
  expect(doc.sys).toHaveProperty('calcs', {})
})

test('Fix an invalid sys object root to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', sys: 'invalid' }
  expect(() => ensureDocHasSystemFields(doc)).not.toThrow()
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('ops', [])
  expect(doc.sys).toHaveProperty('calcs', {})
})

test('Fix an invalid sys object with invalid ops entries to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', sys: { ops: ['a', 'b', { opId: '123' }] } }
  expect(() => ensureDocHasSystemFields(doc)).not.toThrow()
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('ops', [{ opId: '123' }])
  expect(doc.sys).toHaveProperty('calcs', {})
})

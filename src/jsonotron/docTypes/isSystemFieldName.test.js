/* eslint-env jest */
const isSystemFieldName = require('./isSystemFieldName')

test('Recognise system field names.', () => {
  expect(isSystemFieldName('id')).toEqual(true)
  expect(isSystemFieldName('docType')).toEqual(true)
  expect(isSystemFieldName('docOps')).toEqual(true)

  expect(isSystemFieldName('hello')).toEqual(false)
  expect(isSystemFieldName('world')).toEqual(false)
})

/* eslint-env jest */
const isOpIdInDocument = require('./isOpIdInDocument')

const doc = {
  docOps: ['aaa', 'bbb']
}

test('Recognise existing op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'aaa')).toEqual(true)
  expect(isOpIdInDocument(doc, 'bbb')).toEqual(true)
})

test('Recognise new op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'ccc')).toEqual(false)
})

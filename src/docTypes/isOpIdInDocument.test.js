/* eslint-env jest */
import { isOpIdInDocument } from './isOpIdInDocument'

const doc = {
  docHeader: {
    ops: [
      { opId: 'aaa', userIdentity: 'testUser', dateTime: 'then' },
      { opId: 'bbb', userIdentity: 'testUser', dateTime: 'now' }
    ]
  }
}

test('Recognise existing op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'aaa')).toEqual(true)
  expect(isOpIdInDocument(doc, 'bbb')).toEqual(true)
})

test('Recognise new op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'ccc')).toEqual(false)
})

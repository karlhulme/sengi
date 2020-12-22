import { expect, test } from '@jest/globals'
import { Doc } from 'sengi-interfaces'
import { isOpIdInDocument } from './isOpIdInDocument'

const doc: Doc = {
  docOps: [
    { opId: 'aaa' },
    { opId: 'bbb' }
  ]
}

test('Recognise existing op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'aaa')).toEqual(true)
  expect(isOpIdInDocument(doc, 'bbb')).toEqual(true)
})

test('Return false for op ids that are not recorded on a document.', () => {
  expect(isOpIdInDocument(doc, 'ccc')).toEqual(false)
})

test('Return false for if doc does not have a docOps array.', () => {
  expect(isOpIdInDocument({}, 'ccc')).toEqual(false)
})

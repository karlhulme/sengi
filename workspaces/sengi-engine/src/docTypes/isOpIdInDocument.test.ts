import { expect, test } from '@jest/globals'
import { DocRecord } from 'sengi-interfaces'
import { isOpIdInDocument } from './isOpIdInDocument'

const doc: DocRecord = {
  docOpIds: ['aaa', 'bbb']
}

test('Recognise existing op ids on a document.', () => {
  expect(isOpIdInDocument(doc, 'aaa')).toEqual(true)
  expect(isOpIdInDocument(doc, 'bbb')).toEqual(true)
})

test('Return false for op ids that are not recorded on a document.', () => {
  expect(isOpIdInDocument(doc, 'ccc')).toEqual(false)
})

test('Return false if doc does not have a docOpIds array.', () => {
  expect(isOpIdInDocument({}, 'ccc')).toEqual(false)
})

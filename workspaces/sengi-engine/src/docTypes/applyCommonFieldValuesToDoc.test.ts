import { expect, test } from '@jest/globals'
import { DocRecord } from 'sengi-interfaces'
import { applyCommonFieldValuesToDoc } from './applyCommonFieldValuesToDoc'


test('The creation properties are set if not already populated.', () => {
  const doc: DocRecord = {}
  applyCommonFieldValuesToDoc(doc, 5678, 'aUser')
  expect(doc.docCreatedMillisecondsSinceEpoch).toEqual(5678)
  expect(doc.docCreatedByUserId).toEqual('aUser')
  expect(doc.docLastUpdatedMillisecondsSinceEpoch).toEqual(5678)
  expect(doc.docLastUpdatedByUserId).toEqual('aUser')
})

test('The creation properties are ignored if already set, and just updated properties are set.', () => {
  const doc: DocRecord = {
    docCreatedMillisecondsSinceEpoch: 1111,
    docCreatedByUserId: 'originalUser'
  }
  applyCommonFieldValuesToDoc(doc, 5678, 'aUser')
  expect(doc.docCreatedMillisecondsSinceEpoch).toEqual(1111)
  expect(doc.docCreatedByUserId).toEqual('originalUser')
  expect(doc.docLastUpdatedMillisecondsSinceEpoch).toEqual(5678)
  expect(doc.docLastUpdatedByUserId).toEqual('aUser')
})

test('The updation properties are updated with new values.', () => {
  const doc: DocRecord = {
    docCreatedMillisecondsSinceEpoch: 1111,
    docCreatedByUserId: 'originalUser',
    docLastUpdatedMillisecondsSinceEpoch: 1234,
    docLastUpdatedByUserId: 'anotherUser'
  }
  applyCommonFieldValuesToDoc(doc, 5678, 'aUser')
  expect(doc.docCreatedMillisecondsSinceEpoch).toEqual(1111)
  expect(doc.docCreatedByUserId).toEqual('originalUser')
  expect(doc.docLastUpdatedMillisecondsSinceEpoch).toEqual(5678)
  expect(doc.docLastUpdatedByUserId).toEqual('aUser')
})

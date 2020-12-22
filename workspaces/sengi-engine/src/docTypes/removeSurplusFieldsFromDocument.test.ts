import { expect, test } from '@jest/globals'
import { Doc } from 'sengi-interfaces'
import { removeSurplusFieldsFromDocument } from './removeSurplusFieldsFromDocument'

test('Remove surplus fields from document.', () => {
  const doc: Doc = { propA: 'hello', propB: 'big', propC: 'world' }
  removeSurplusFieldsFromDocument(doc, ['propA', 'propC'])
  expect(doc).toEqual({ propA: 'hello', propC: 'world' })
})

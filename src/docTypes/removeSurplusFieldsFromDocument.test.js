/* eslint-env jest */
import { removeSurplusFieldsFromDocument } from './removeSurplusFieldsFromDocument'

test('Remove surplus fields from document.', () => {
  const doc = { propA: 'hello', propB: 'big', propC: 'world' }
  removeSurplusFieldsFromDocument(doc, ['propA', 'propC'])
  expect(doc).toEqual({ propA: 'hello', propC: 'world' })
})

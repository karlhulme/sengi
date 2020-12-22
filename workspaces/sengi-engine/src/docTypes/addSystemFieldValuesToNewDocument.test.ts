import { expect, test } from '@jest/globals'
import { Doc } from 'sengi-interfaces'
import { addSystemFieldValuesToNewDocument } from './addSystemFieldValuesToNewDocument'

test('Add the system fields to a new doc overwriting existing properties.', () => {
  const doc: Doc = {}
  addSystemFieldValuesToNewDocument(doc, 'test', '123')
  expect(doc).toHaveProperty('id', '123')
  expect(doc).toHaveProperty('docType', 'test')
  expect(doc).toHaveProperty('docOps', [])
})

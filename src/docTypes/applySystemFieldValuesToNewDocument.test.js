/* eslint-env jest */
const applySystemFieldValuesToNewDocument = require('./applySystemFieldValuesToNewDocument')

const docType = {
  name: 'test'
}

test('Apply common fields to a new doc.', () => {
  const doc = {}
  applySystemFieldValuesToNewDocument(docType, doc, '123')
  expect(doc).toHaveProperty('id', '123')
  expect(doc).toHaveProperty('docType', 'test')
  expect(doc).toHaveProperty('docOps', [])
})

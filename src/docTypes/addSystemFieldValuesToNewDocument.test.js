/* eslint-env jest */
const addSystemFieldValuesToNewDocument = require('./addSystemFieldValuesToNewDocument')

const docType = {
  name: 'test'
}

test('Add the system fields to a new doc overwriting existing properties.', () => {
  const doc = {}
  addSystemFieldValuesToNewDocument(docType, doc, '123', 'testUser', 'now')
  expect(doc).toHaveProperty('id', '123')
  expect(doc).toHaveProperty('docType', 'test')
  expect(doc).toHaveProperty('docHeader')
  expect(doc.docHeader).toHaveProperty('origin', {
    style: 'new',
    userIdentity: 'testUser',
    dateTime: 'now'
  })
  expect(doc.docHeader).toHaveProperty('updated', {
    userIdentity: 'testUser',
    dateTime: 'now'
  })
  expect(doc.docHeader).toHaveProperty('ops', [])
  expect(doc.docHeader).toHaveProperty('calcs', {})
})

/* eslint-env jest */
const applySystemFieldValuesToNewDocument = require('./applySystemFieldValuesToNewDocument')

const docType = {
  name: 'test'
}

test('Apply common fields to a new doc.', () => {
  const doc = {}
  applySystemFieldValuesToNewDocument(docType, doc, '123', 'testUser', 'now')
  expect(doc).toHaveProperty('id', '123')
  expect(doc).toHaveProperty('docType', 'test')
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('origin', {
    style: 'new',
    userIdentity: 'testUser',
    dateTime: 'now'
  })
  expect(doc.sys).toHaveProperty('updated', {
    userIdentity: 'testUser',
    dateTime: 'now'
  })
  expect(doc.sys).toHaveProperty('ops', [])
  expect(doc.sys).toHaveProperty('calcs', {})
})

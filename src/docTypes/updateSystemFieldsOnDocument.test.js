/* eslint-env jest */
const updateSystemFieldsOnDocument = require('./updateSystemFieldsOnDocument')

test('Apply common fields to an updated doc.', () => {
  const doc = { docVersion: 'Version1', docOps: [] }
  updateSystemFieldsOnDocument({}, doc, 'abc')
  expect(doc).toHaveProperty('docOps', ['abc'])
})

test('Apply common fields to an updated doc at the limit of doc ops.', () => {
  const docType = { policy: { maxOpsSize: 3 } }
  const doc = { docVersion: 'Version1', docOps: ['aaa', 'bbb', 'ccc'] }
  updateSystemFieldsOnDocument(docType, doc, 'abc')
  expect(doc).toHaveProperty('docOps', ['bbb', 'ccc', 'abc'])
})

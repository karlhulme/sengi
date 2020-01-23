/* eslint-env jest */
const updateDocOpsOnDocument = require('./updateDocOpsOnDocument')

test('Apply latest operation id to the doc ops.', () => {
  const doc = { docVersion: 'Version1', docOps: [] }
  updateDocOpsOnDocument({}, doc, 'abc')
  expect(doc).toHaveProperty('docOps', ['abc'])
})

test('Apply latest operation id at the limit of doc ops.', () => {
  const docType = { policy: { maxOpsSize: 3 } }
  const doc = { docVersion: 'Version1', docOps: ['aaa', 'bbb', 'ccc'] }
  updateDocOpsOnDocument(docType, doc, 'abc')
  expect(doc).toHaveProperty('docOps', ['bbb', 'ccc', 'abc'])
})

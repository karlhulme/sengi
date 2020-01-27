/* eslint-env jest */
const applySystemFieldValuesToUpdatedDocument = require('./applySystemFieldValuesToUpdatedDocument')

test('Apply latest operation id to the doc ops.', () => {
  const doc = { docVersion: 'Version1', sys: { ops: [] } }
  applySystemFieldValuesToUpdatedDocument({}, doc, 'abc', 'testUser', 'now', 'patch')
  expect(doc.sys.ops).toEqual([{ opId: 'abc', userIdentity: 'testUser', dateTime: 'now', style: 'patch' }])
  expect(doc.sys.updated).toEqual({ userIdentity: 'testUser', dateTime: 'now' })
})

test('Apply latest operation id at the limit of doc ops.', () => {
  const docType = { policy: { maxOpsSize: 3 } }
  const doc = {
    docVersion: 'Version1',
    sys: {
      ops: [
        { opId: 'aaa', userIdentity: 'testUser', dateTime: 'then', style: 'patch' },
        { opId: 'bbb', userIdentity: 'testUser', dateTime: 'then', style: 'patch' },
        { opId: 'ccc', userIdentity: 'testUser', dateTime: 'then', style: 'patch' }
      ]
    }
  }
  applySystemFieldValuesToUpdatedDocument(docType, doc, 'abc', 'testUser', 'now', 'operation', 'addFive')
  expect(doc.sys.ops).toEqual([
    { opId: 'bbb', userIdentity: 'testUser', dateTime: 'then', style: 'patch' },
    { opId: 'ccc', userIdentity: 'testUser', dateTime: 'then', style: 'patch' },
    { opId: 'abc', userIdentity: 'testUser', dateTime: 'now', style: 'operation', operationName: 'addFive' }
  ])
  expect(doc.sys.updated).toEqual({ userIdentity: 'testUser', dateTime: 'now' })
})

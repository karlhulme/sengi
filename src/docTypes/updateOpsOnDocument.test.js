/* eslint-env jest */
const updateOpsOnDocument = require('./updateOpsOnDocument')

test('Apply latest operation id to the doc ops.', () => {
  const doc = { docVersion: 'Version1', sys: { ops: [] } }
  updateOpsOnDocument({}, doc, 'abc', 'testUser', 'now')
  expect(doc.sys.ops).toEqual([{ opId: 'abc', userIdentity: 'testUser', dateTime: 'now' }])
})

test('Apply latest operation id at the limit of doc ops.', () => {
  const docType = { policy: { maxOpsSize: 3 } }
  const doc = {
    docVersion: 'Version1',
    sys: {
      ops: [
        { opId: 'aaa', userIdentity: 'testUser', dateTime: 'then' },
        { opId: 'bbb', userIdentity: 'testUser', dateTime: 'then' },
        { opId: 'ccc', userIdentity: 'testUser', dateTime: 'then' }
      ]
    }
  }
  updateOpsOnDocument(docType, doc, 'abc', 'testUser', 'now')
  expect(doc.sys.ops).toEqual([
    { opId: 'bbb', userIdentity: 'testUser', dateTime: 'then' },
    { opId: 'ccc', userIdentity: 'testUser', dateTime: 'then' },
    { opId: 'abc', userIdentity: 'testUser', dateTime: 'now' }
  ])
})

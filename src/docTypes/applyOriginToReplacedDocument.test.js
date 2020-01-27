/* eslint-env jest */
const applyOriginToReplacedDocument = require('./applyOriginToReplacedDocument')

test('Apply origin to a replaced doc.', () => {
  const doc = {}
  applyOriginToReplacedDocument(doc, 'testUser', 'now')
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('origin', {
    style: 'replace',
    userIdentity: 'testUser',
    dateTime: 'now'
  })
})

test('Do not apply origin if replaced doc already has one.', () => {
  const doc = {
    sys: {
      origin: {
        style: 'new',
        userIdentity: 'originalUser',
        dateTime: 'then'
      }
    }
  }
  applyOriginToReplacedDocument(doc, 'testUser', 'now')
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('origin', {
    style: 'new',
    userIdentity: 'originalUser',
    dateTime: 'then'
  })
})

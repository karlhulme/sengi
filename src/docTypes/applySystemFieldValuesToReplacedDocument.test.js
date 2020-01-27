/* eslint-env jest */
const applySystemFieldValuesToReplacedDocument = require('./applySystemFieldValuesToReplacedDocument')

test('Apply origin and updated properties to a replaced doc.', () => {
  const doc = {}
  applySystemFieldValuesToReplacedDocument(doc, 'testUser', 'now')
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('origin', {
    style: 'replace',
    userIdentity: 'testUser',
    dateTime: 'now'
  })
  expect(doc.sys).toHaveProperty('updated', {
    userIdentity: 'testUser',
    dateTime: 'now'
  })
})

test('Do not apply origin if replaced doc already has one (but do replace updated property).', () => {
  const doc = {
    sys: {
      origin: {
        style: 'new',
        userIdentity: 'originalUser',
        dateTime: 'then'
      },
      updated: {
        userIdentity: 'originalUser',
        dateTime: 'then'
      }
    }
  }
  applySystemFieldValuesToReplacedDocument(doc, 'testUser', 'now')
  expect(doc).toHaveProperty('sys')
  expect(doc.sys).toHaveProperty('origin', {
    style: 'new',
    userIdentity: 'originalUser',
    dateTime: 'then'
  })
  expect(doc.sys).toHaveProperty('updated', {
    userIdentity: 'testUser',
    dateTime: 'now'
  })
})

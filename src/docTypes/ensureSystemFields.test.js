/* eslint-env jest */
const ensureSystemFields = require('./ensureSystemFields')

test('Accept a document that has all the system fields.', () => {
  expect(() => ensureSystemFields({ id: 'aaa', docType: 'bbb' }, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
})

test('Reject a document that is missing an id field.', () => {
  expect(() => ensureSystemFields({ docType: 'bbb' }, 'new', 'testUser', '2020-08-28T16:42:10Z')).toThrow(/id/)
})

test('Reject a document that is missing a docType field.', () => {
  expect(() => ensureSystemFields({ id: 'aaa' }, 'new', 'testUser', '2020-08-28T16:42:10Z')).toThrow(/docType/)
})

const newlyCreatedDocHeader = {
  origin: {
    style: 'new',
    userIdentity: 'testUser',
    dateTime: '2020-08-28T16:42:10Z'
  },
  updated: {
    userIdentity: 'testUser',
    dateTime: '2020-08-28T16:42:10Z'
  },
  ops: [],
  calcs: {}
}

test('Append a missing docHeader object to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb' }
  expect(() => ensureSystemFields(doc, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
  expect(doc.docHeader).toEqual(newlyCreatedDocHeader)
})

test('Fix an invalid docHeader object to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', docHeader: 'invalid' }
  expect(() => ensureSystemFields(doc, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
  expect(doc.docHeader).toEqual(newlyCreatedDocHeader)
})

test('Fix a docHeader with invalid properties to make it valid.', () => {
  const doc = { id: 'aaa', docType: 'bbb', docHeader: { origin: 'invalid', updated: 'invalid', ops: 'invalid', calcs: 'invalid' } }
  expect(() => ensureSystemFields(doc, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
  expect(doc.docHeader).toEqual(newlyCreatedDocHeader)
})

test('Fix a docHeader with an invalid ops entry to make it valid.', () => {
  const doc = {
    id: 'aaa',
    docType: 'bbb',
    docHeader: {
      ops: [
        'a',
        'b',
        { opId: '123' },
        { opId: '321', userIdentity: 'testUser', dateTime: 'now', style: 'patch' }
      ]
    }
  }
  expect(() => ensureSystemFields(doc, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
  expect(doc).toHaveProperty('docHeader')
  expect(doc.docHeader).toHaveProperty('ops', [{ opId: '321', userIdentity: 'testUser', dateTime: 'now', style: 'patch' }])
  expect(doc.docHeader).toHaveProperty('calcs', {})
})

const existingDocHeader = {
  origin: {
    style: 'replace',
    userIdentity: 'testUser',
    dateTime: '2020-08-28T16:42:10Z'
  },
  updated: {
    userIdentity: 'testUser',
    dateTime: '2020-08-28T16:42:10Z'
  },
  ops: [],
  calcs: {}
}

test('Leave a valid docHeader alone.', () => {
  const doc = {
    id: 'aaa',
    docType: 'bbb',
    docHeader: { ...existingDocHeader }
  }
  expect(() => ensureSystemFields(doc, 'new', 'testUser', '2020-08-28T16:42:10Z')).not.toThrow()
  expect(doc.docHeader).toEqual(existingDocHeader)
})

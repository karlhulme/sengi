/* eslint-env jest */
const {
  JsonotronActionForbiddenByPolicyError,
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('jsonotron-errors')
const { errorCodes, successCodes } = require('jsonotron-consts')
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const replaceDocument = require('./replaceDocument')

test('Replacing a document should call upsert on the doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({})
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    sys: {
      origin: {
        style: 'replace',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [],
      calcs: {
        displayName: {
          value: 'Francesco'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, {}, { custom: 'prop' }])
})

test('Replacing a document raise callbacks.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({})
  })

  const onPreSaveDoc = jest.fn()
  const onUpdateDoc = jest.fn()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'aaaa',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    reqProps: { foo: 'bar' },
    onPreSaveDoc,
    onUpdateDoc,
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isNew: false })

  expect(onPreSaveDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' }),
    mergePatch: null
  })

  expect(onUpdateDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' })
  })
})

test('Replacing a document with a required version should call upsert on the doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({})
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    reqVersion: 'aaaa',
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    sys: {
      origin: {
        style: 'replace',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [],
      calcs: {
        displayName: {
          value: 'Francesco'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    docVersion: 'bbbb',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Replacing a non-existent document with a version that contains additional unrecognised fields should still call upsert on the doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_CREATED })
  })

  const onPreSaveDoc = jest.fn()
  const onCreateDoc = jest.fn()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple'],
      unrecognisedProperty: 'unrecognisedValue'
    },
    onPreSaveDoc,
    onCreateDoc,
    reqVersion: 'aaaa',
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isNew: true })

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    sys: {
      origin: {
        style: 'replace',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [],
      calcs: {
        displayName: {
          value: 'Francesco'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    docVersion: 'bbbb',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple'],
    unrecognisedProperty: 'unrecognisedValue'
  }

  expect(onPreSaveDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { meta: 'data' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' }),
    mergePatch: null
  })

  expect(onCreateDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { meta: 'data' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' })
  })

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to replace a document with an unavailable required version.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    reqVersion: 'aaaa',
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    sys: {
      origin: {
        style: 'replace',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [],
      calcs: {
        displayName: {
          value: 'Francesco'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    docVersion: 'bbbb',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to replace a document if it does not conform to the doc type schema.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortNamePropertyRequiredButMissing: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple'],
      madeupProperty: 'madeupValue'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronDocumentFieldsValidationError)
})

test('Fail to replace a document if it fails custom validation.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple'],
      addressLines: 'i live in a castle'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronDocumentCustomValidationError)
})

test('Fail to replace a document if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('Fail to replace a document if disallowed by doc type policy.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'car',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'car',
      docVersion: 'aaaa',
      manufacturer: 'Honda',
      model: 'Accord',
      registration: 'HG67 8HJ'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronActionForbiddenByPolicyError)
})

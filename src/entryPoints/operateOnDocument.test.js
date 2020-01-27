/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { errorCodes } = require('../docStore')
const {
  JsonotronConflictOnSaveError,
  JsonotronDocumentNotFoundError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError,
  JsonotronUnrecognisedOperationNameError
} = require('../errors')
const operateOnDocument = require('./operateOnDocument')

test('Operate on document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones)..', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan',
        unrecognisedProp: 'unrecognisedValue'
      }
    }),
    upsert: async () => ({})
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }],
      calcs: {
        displayName: {
          value: 'Mikey'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold'],
    unrecognisedProp: 'unrecognisedValue'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Operate on document should raise callbacks', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan',
        unrecognisedProp: 'unrecognisedValue'
      }
    }),
    upsert: async () => ({})
  })

  let preSaveDoc = null
  const onPreSaveDoc = jest.fn(p => { preSaveDoc = JSON.parse(JSON.stringify(p.doc)) })
  const onUpdateDoc = jest.fn()

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    onPreSaveDoc,
    onUpdateDoc,
    reqProps: { foo: 'bar' },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(onPreSaveDoc.mock.calls[0][0]).toEqual(expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    mergePatch: {
      favouriteColors: ['silver', 'puse', 'gold']
    }
  }))
  expect(preSaveDoc.favouriteColors).not.toBeDefined()

  expect(onUpdateDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ fullName: 'Mikey Manhattan', tenantId: 'dddd', favouriteColors: ['silver', 'puse', 'gold'] })
  })
})

test('Operate on document for second time should only call fetch on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        sys: {
          ops: [{
            opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
            userIdentity: 'testUser',
            dateTime: '2000-01-01T12:00:00Z',
            style: 'operation',
            operationName: 'replaceFavouriteColors'
          }]
        },
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan'
      }
    })
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: false })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Operate on document using a required version should call exists and upsert on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan'
      }
    }),
    upsert: async () => ({})
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    reqVersion: 'aaaa',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }],
      calcs: {
        displayName: {
          value: 'Mikey'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to operate on document when required version is not available.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'bbbb',
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan'
      }
    }),
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    reqVersion: 'aaaa',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'bbbb',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }],
      calcs: {
        displayName: {
          value: 'Mikey'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to operate on document if it changes between fetch and upsert.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        sys: {
          ops: []
        },
        docVersion: 'aaaa',
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan'
      }
    }),
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronConflictOnSaveError)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }],
      calcs: {
        displayName: {
          value: 'Mikey'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to operate on document if it does not exist.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: null
    })
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-888888888888',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    }
  })).rejects.toThrow(JsonotronDocumentNotFoundError)
})

test('Fail to invoke an operation if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      favouriteColors: ['puse', 'gold']
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('Fail to operate on document using an unknown operation.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: null
    })
  })

  await expect(operateOnDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'car',
    id: 'bd605c90-67c0-4125-a404-4fff3366d6ac',
    operationId: 'a2c9bec0-ab03-4ded-bce6-d8a91f71e1d4',
    operationName: 'unknownOperation',
    operationParams: {}
  })).rejects.toThrow(JsonotronUnrecognisedOperationNameError)
})

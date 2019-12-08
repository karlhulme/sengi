/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { errorCodes } = require('../docStore')
const {
  JsonotronDocumentNotFoundError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('../errors')
const operateOnDocument = require('./operateOnDocument')

test('Operate on document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones)..', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
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
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['db93acbc-bc8a-4cf0-a5c9-ffaafcb54028'],
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold'],
    unrecognisedProp: 'unrecognisedValue'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Operate on document for second time should only call fetch on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: ['db93acbc-bc8a-4cf0-a5c9-ffaafcb54028'],
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
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Operate on document using a required version should call exists and upsert on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
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
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['db93acbc-bc8a-4cf0-a5c9-ffaafcb54028'],
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to operate on document when required version is not available.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'bbbb',
        docOps: [],
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'bbbb',
    docOps: ['db93acbc-bc8a-4cf0-a5c9-ffaafcb54028'],
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to operate on document if it changes between fetch and upsert.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
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
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['db93acbc-bc8a-4cf0-a5c9-ffaafcb54028'],
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
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

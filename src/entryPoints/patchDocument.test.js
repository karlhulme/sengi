/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const {
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentNotFoundError,
  JsonotronMergePatchValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('../errors')
const { errorCodes } = require('../docStore')
const patchDocument = require('./patchDocument')

test('Patching a document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones).', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey',
        unrecognisedProp: 'unrecognisdValue'
      }
    }),
    upsert: async () => ({})
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey',
    unrecognisedProp: 'unrecognisdValue'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Patching a document for a second time should only call fetch on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: ['3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    })
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: false })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Patching a document using a required version should call fetch and upsert on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    }),
    upsert: async () => ({})
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to patch document when required version is not available.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'bbbb',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    }),
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'bbbb',
    docOps: ['3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to patch document if it changes between fetch and upsert.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    }),
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: ['3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Reject a patch to a non-existent doc.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: null
    })
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-aaaaaaaaaaaa',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronDocumentNotFoundError)
})

test('Reject a patch to any field that is not explicitly allowed for patching.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    })
  })

  const fn = () => {
    return patchDocument({
      ...testRequest,
      roleNames: ['admin'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        pinCode: 4444
      },
      docStoreOptions: { custom: 'prop' }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronMergePatchValidationError)
  await expect(fn()).rejects.toThrow(/pinCode/)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Reject a patch to a non-existent field.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    })
  })

  const fn = () => {
    return patchDocument({
      ...testRequest,
      roleNames: ['admin'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        madeup: 'value'
      },
      docStoreOptions: { custom: 'prop' }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronMergePatchValidationError)
  await expect(fn()).rejects.toThrow(/madeup/)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Reject a patch with a field value that is invalid.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    })
  })

  const fn = () => {
    return patchDocument({
      ...testRequest,
      roleNames: ['admin'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        shortName: 123
      },
      docStoreOptions: { custom: 'prop' }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronMergePatchValidationError)
  await expect(fn()).rejects.toThrow(/should be string/)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Reject a patch that would change a system field.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey'
      }
    })
  })

  const fn = () => {
    return patchDocument({
      ...testRequest,
      roleNames: ['admin'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        id: 'aaaaaaaa-065a-4691-a7c8-2d84ec746ba9'
      },
      docStoreOptions: { custom: 'prop' }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronMergePatchValidationError)
  await expect(fn()).rejects.toThrow(/id/)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Reject a patch that would leave the document in an invalid state.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car',
        docVersion: 'aaaa',
        docOps: [],
        manufacturer: 'Ford',
        model: 'T',
        registration: 'HG12 5GH'
      }
    })
  })

  const fn = () => {
    return patchDocument({
      ...testRequest,
      roleNames: ['admin'],
      docTypeName: 'car',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        registration: 'AB78 9KL'
      },
      docStoreOptions: { custom: 'prop' }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronDocumentCustomValidationError)
  await expect(fn()).rejects.toThrow(/Unrecognised vehicle registration prefix/)

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['car', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['car', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
})

test('Fail to patch a document if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

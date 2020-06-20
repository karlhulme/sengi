/* eslint-env jest */
const {
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentNotFoundError,
  JsonotronMergePatchValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('jsonotron-errors')
const { errorCodes } = require('jsonotron-consts')
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const patchDocument = require('./patchDocument')

test('Patching a document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones).', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        sys: {},
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

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
        opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'patch'
      }],
      calcs: {
        displayName: {
          value: 'Maisory'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey',
    unrecognisedProp: 'unrecognisdValue'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Patching a document should raise callbacks.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey',
        unrecognisedProp: 'unrecognisdValue'
      }
    }),
    upsert: async () => ({})
  })

  let preSaveDoc = null
  const onPreSaveDoc = jest.fn(p => { preSaveDoc = JSON.parse(JSON.stringify(p.doc)) })
  const onUpdateDoc = jest.fn()

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
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
      shortName: 'Maisory'
    }
  }))
  expect(preSaveDoc.shortName).toEqual('David')

  expect(onUpdateDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Maisory' })
  })
})

test('Patching a document for a second time should only call fetch on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        sys: {
          ops: [{ opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7', userIdentity: 'testUser', dateTime: '2000-01-01T13:12:00Z', style: 'patch' }]
        },
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Patching a document using a required version should call fetch and upsert on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

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
        opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'patch'
      }],
      calcs: {
        displayName: {
          value: 'Maisory'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Patching a document should invoke the pre-save function.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: 'c06bd029-1bde-437f-82fe-fe4018f6d030',
        docType: 'car',
        docVersion: 'aaaa',
        sys: {},
        originalOwner: 'David',
        manufacturer: 'Volkswagon',
        model: 'Polo',
        registration: 'HG53 8AB',
        unrecognisedProp: 'unrecognisdValue'
      }
    }),
    upsert: async () => ({})
  })

  await expect(patchDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'car',
    id: 'c06bd029-1bde-437f-82fe-fe4018f6d030',
    operationId: '46463f8b-c858-4b28-9c51-a675d7b74830',
    mergePatch: {
      model: 'Golf'
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isUpdated: true })

  expect(testRequest.mockedDocStore.fetch.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['car', 'cars', 'c06bd029-1bde-437f-82fe-fe4018f6d030', {}, { custom: 'prop' }])

  const resultDoc = {
    id: 'c06bd029-1bde-437f-82fe-fe4018f6d030',
    docType: 'car',
    docVersion: 'aaaa',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: '46463f8b-c858-4b28-9c51-a675d7b74830',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'patch'
      }],
      calcs: {
        displayName: {
          value: 'Volkswagon Golf'
        }
      }
    },
    manufacturer: 'Volkswagon',
    model: 'Golf',
    registration: 'HG53 8AB',
    unrecognisedProp: 'unrecognisdValue'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['car', 'cars', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to patch document when required version is not available.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'bbbb',
        sys: {
          ops: [],
          calcs: {}
        },
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

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
        opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'patch'
      }],
      calcs: {
        displayName: {
          value: 'Maisory'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to patch document if it changes between fetch and upsert.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    sys: {
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'patch'
      }],
      calcs: {
        displayName: {
          value: 'Maisory'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    docVersion: 'aaaa',
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Reject a patch to a non-existent field.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Reject a patch with a field value that is invalid.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Reject a patch that would change a system field.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Reject a patch that would leave the document in an invalid state.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car',
        docVersion: 'aaaa',
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
  expect(testRequest.mockedDocStore.fetch.mock.calls[0]).toEqual(['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.fetch.mock.calls[1]).toEqual(['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
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

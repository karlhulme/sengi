/* eslint-env jest */
const {
  JsonotronConflictOnSaveError,
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentNotFoundError,
  JsonotronInvalidMergePatchError,
  JsonotronMergePatchValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('jsonotron-errors')
const { errorCodes, successCodes } = require('jsonotron-consts')
const { createJsonotronWithMockStore, defaultRequestProps } = require('./shared.test')

const createJsonotronForTest = (upsertResponse, funcs) => {
  return createJsonotronWithMockStore({
    fetch: async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docHeader: {
          origin: { userIdentity: 'testUser', dateTime: '2019-01-01T14:22:03Z' },
          updated: { userIdentity: 'testUser', dateTime: '2019-01-01T14:22:03Z' },
          ops: [{
            opId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
            userIdentity: 'testUser',
            dateTime: '2020-03-04T12:00:00Z',
            style: 'patch'
          }],
          calcs: {}
        },
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey',
        unrecognisedProp: 'unrecognisedValue',
        pinCode: 3333
      }
    }),
    upsert: async () => upsertResponse || ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_REPLACED })
  }, funcs)
}

test('Patching a document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones).', async () => {
  const jsonotron = createJsonotronForTest()

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(jsonotron._test.docStore.fetch.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docHeader: {
      origin: {
        userIdentity: 'testUser',
        dateTime: '2019-01-01T14:22:03Z'
      },
      updated: {
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z'
      },
      ops: [{
        opId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
        userIdentity: 'testUser',
        dateTime: '2020-03-04T12:00:00Z',
        style: 'patch'
      }, {
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
    unrecognisedProp: 'unrecognisedValue',
    pinCode: 3333
  }

  expect(jsonotron._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Patching a document should invoke the onPreSaveDoc and onUpdateDoc delegates.', async () => {
  let preSaveDoc = null

  const jsonotron = createJsonotronForTest(null, {
    onPreSaveDoc: jest.fn(p => { preSaveDoc = JSON.parse(JSON.stringify(p.doc)) }),
    onUpdateDoc: jest.fn()
  })

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(jsonotron._test.config.onPreSaveDoc.mock.calls.length).toEqual(1)
  expect(jsonotron._test.config.onPreSaveDoc.mock.calls[0]).toEqual([expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    mergePatch: {
      shortName: 'Maisory'
    }
  })])

  expect(preSaveDoc.shortName).toEqual('David')

  expect(jsonotron._test.config.onUpdateDoc.mock.calls.length).toEqual(1)
  expect(jsonotron._test.config.onUpdateDoc.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Maisory' })
  }])
})

test('Patching a document for a second time should only call fetch on doc store.', async () => {
  const jsonotron = createJsonotronForTest()

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: false })

  expect(jsonotron._test.docStore.fetch.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

  expect(jsonotron._test.docStore.upsert.mock.calls.length).toEqual(0)
})

test('Patching a document using a required version should cause the required version to be passed to the doc store.', async () => {
  const jsonotron = createJsonotronForTest()

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(jsonotron._test.docStore.fetch.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

  expect(jsonotron._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', expect.anything(), { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to patch document when required version is not available.', async () => {
  const jsonotron = createJsonotronForTest({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    },
    reqVersion: 'aaaa' // if upsert yields DOC_STORE_REQ_VERSION_NOT_AVAILABLE and reqVersion is specified then versionNotAvailable error is raised
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)
})

test('Fail to patch document if it changes between fetch and upsert.', async () => {
  const jsonotron = createJsonotronForTest({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
    // if upsert yields DOC_STORE_REQ_VERSION_NOT_AVAILABLE and reqVersion is NOT specified then conflictOnSave error is raised
  })).rejects.toThrow(JsonotronConflictOnSaveError)
})

test('Reject a patch to a non-existent doc.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    fetch: async () => ({ doc: null })
  })

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-aaaaaaaaaaaa',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).rejects.toThrow(JsonotronDocumentNotFoundError)
})

test('Reject a patch to any field that is not explicitly allowed for patching.', async () => {
  const jsonotron = createJsonotronForTest()

  const fn = () => {
    return jsonotron.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        pinCode: 4444
      }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronInvalidMergePatchError)
  await expect(fn()).rejects.toThrow(/pinCode/)
})

test('Accept a patch to an unrecognised field although it has no effect.', async () => {
  const jsonotron = createJsonotronForTest()

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      madeup: 'value'
    }
  })).resolves.toEqual({ isUpdated: true })
})

test('Reject a patch with a field value that is invalid.', async () => {
  const jsonotron = createJsonotronForTest()

  const fn = () => {
    return jsonotron.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        shortName: 123
      }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronMergePatchValidationError)
  await expect(fn()).rejects.toThrow(/should be string/)
})

test('Reject a patch that would change a system field.', async () => {
  const jsonotron = createJsonotronForTest()

  const fn = () => {
    return jsonotron.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        id: 'aaaaaaaa-065a-4691-a7c8-2d84ec746ba9'
      }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronInvalidMergePatchError)
  await expect(fn()).rejects.toThrow(/id/)
})

test('Reject a patch that would leave the document in an invalid state.', async () => {
  const jsonotron = createJsonotronForTest()

  const fn = () => {
    return jsonotron.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        addressLines: 'I live in a castle - which is not allowed'
      }
    })
  }

  await expect(fn()).rejects.toThrow(JsonotronDocumentCustomValidationError)
  await expect(fn()).rejects.toThrow(/No castle dwellers allowed/)
})

test('Fail to patch a document if permissions insufficient.', async () => {
  const jsonotron = createJsonotronForTest()

  await expect(jsonotron.patchDocument({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

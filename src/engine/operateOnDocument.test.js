import { test, expect, jest } from '@jest/globals'
import {
  SengiConflictOnSaveError,
  SengiDocumentNotFoundError,
  SengiInsufficientPermissionsError,
  SengiRequiredVersionNotAvailableError,
  SengiUnrecognisedOperationNameError
} from '../errors'
import { errorCodes, successCodes } from '../consts'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTest = (upsertResponse, funcs) => {
  return createSengiWithMockStore({
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
            style: 'operation',
            operationName: 'replaceFavouriteColors'
          }],
          calcs: {}
        },
        tenantId: 'dddd',
        shortName: 'Mikey',
        fullName: 'Mikey Manhattan',
        unrecognisedProp: 'unrecognisedValue'
      }
    }),
    upsert: async () => upsertResponse || ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_REPLACED })
  }, funcs)
}

test('Operate on document should call fetch and upsert on doc store while retaining existing properties, including unrecognised ones.', async () => {
  const sengi = createSengiForTest()

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(sengi._test.docStore.fetch.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

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
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }, {
        opId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
        userIdentity: 'testUser',
        dateTime: '2020-01-01T14:22:03Z',
        style: 'operation',
        operationName: 'replaceFavouriteColors'
      }],
      calcs: { displayName: { value: 'Mikey' }, fullAddress: { value: '' } }
    },
    tenantId: 'dddd',
    shortName: 'Mikey',
    fullName: 'Mikey Manhattan',
    favouriteColors: ['silver', 'puse', 'gold'],
    unrecognisedProp: 'unrecognisedValue'
  }

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Operate on document should raise callbacks.', async () => {
  let preSaveDoc = null

  const sengi = createSengiForTest(
    null, {
      onPreSaveDoc: jest.fn(p => { preSaveDoc = JSON.parse(JSON.stringify(p.doc)) }),
      onUpdateDoc: jest.fn()
    }
  )

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(sengi._test.config.onPreSaveDoc.mock.calls.length).toEqual(1)
  expect(sengi._test.config.onPreSaveDoc.mock.calls[0]).toEqual([expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    mergePatch: {
      favouriteColors: ['silver', 'puse', 'gold']
    }
  })])

  expect(preSaveDoc.favouriteColors).not.toBeDefined()

  expect(sengi._test.config.onUpdateDoc.mock.calls.length).toEqual(1)
  expect(sengi._test.config.onUpdateDoc.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ fullName: 'Mikey Manhattan', tenantId: 'dddd', favouriteColors: ['silver', 'puse', 'gold'] })
  }])
})

test('Operate on document for second time should only call fetch on doc store.', async () => {
  const sengi = createSengiForTest()

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
  })).resolves.toEqual({ isUpdated: false })

  expect(sengi._test.docStore.fetch.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.fetch.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(0)
})

test('Operate on document using a required version should cause required version to be passed to doc store.', async () => {
  const sengi = createSengiForTest()

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    },
    reqVersion: 'aaaa'
  })).resolves.toEqual({ isUpdated: true })

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', expect.anything(), { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Fail to operate on document when required version is not available.', async () => {
  const sengi = createSengiForTest({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    },
    reqVersion: 'bbbb' // if upsert yields DOC_STORE_REQ_VERSION_NOT_AVAILABLE and reqVersion is specified then versionNotAvailable error is raised
  })).rejects.toThrow(SengiRequiredVersionNotAvailableError)
})

test('Fail to operate on document if it changes between fetch and upsert.', async () => {
  const sengi = createSengiForTest({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
    // if upsert yields DOC_STORE_REQ_VERSION_NOT_AVAILABLE and reqVersion is NOT specified then conflictOnSave error is raised
  })).rejects.toThrow(SengiConflictOnSaveError)
})

test('Fail to operate on document if it does not exist.', async () => {
  const sengi = createSengiWithMockStore({
    fetch: async () => ({ doc: null })
  })

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-888888888888',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
  })).rejects.toThrow(SengiDocumentNotFoundError)
})

test('Fail to invoke an operation if permissions insufficient.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: 'db93acbc-bc8a-4cf0-a5c9-ffaafcb54028',
    operationName: 'replaceFavouriteColors',
    operationParams: {
      newFavouriteColors: ['puse', 'gold']
    }
  })).rejects.toThrow(SengiInsufficientPermissionsError)
})

test('Fail to operate on document using an unknown operation.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.operateOnDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    id: 'bd605c90-67c0-4125-a404-4fff3366d6ac',
    operationId: 'a2c9bec0-ab03-4ded-bce6-d8a91f71e1d4',
    operationName: 'unknownOperation',
    operationParams: {}
  })).rejects.toThrow(SengiUnrecognisedOperationNameError)
})

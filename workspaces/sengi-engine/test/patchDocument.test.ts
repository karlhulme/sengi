import { test, expect, jest } from '@jest/globals'
import {
  SengiConflictOnSaveError,
  SengiDocTypeValidateFunctionError,
  SengiDocNotFoundError,
  SengiInsufficientPermissionsError,
  SengiRequiredVersionNotAvailableError,
  DocStoreUpsertResultCode,
  DocStoreUpsertResult,
  SengiPatchValidationFailedError
} from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTest = (upsertResponse?: DocStoreUpsertResult, sengiCtorOverrides?: Record<string, unknown>) => {
  return createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'person',
        docVersion: 'aaaa',
        docOps: [{
          opId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
          style: 'operation',
          operationName: 'replaceFavouriteColors'
        }],
        tenantId: 'dddd',
        shortName: 'David',
        fullName: 'David Doohickey',
        unrecognisedProp: 'unrecognisedValue',
        pinCode: 3333
      }
    })),
    upsert: jest.fn(async () => upsertResponse || ({ code: DocStoreUpsertResultCode.REPLACED }))
  }, sengiCtorOverrides)
}

test('Patching a document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones).', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docVersion: 'aaaa',
    docOps: [{
      opId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
      style: 'operation',
      operationName: 'replaceFavouriteColors'
    }, {
      opId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      style: 'patch'
    }],
    tenantId: 'dddd',
    shortName: 'Maisory',
    fullName: 'David Doohickey',
    unrecognisedProp: 'unrecognisedValue',
    pinCode: 3333,
    displayName: 'Maisory',
    fullAddress: ''
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', resultDoc, { custom: 'prop' }, { reqVersion: 'aaaa' }])
})

test('Patching a document should invoke the onPreSaveDoc and onUpdateDoc delegates.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiForTest(undefined, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: jest.fn()
  })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Maisory'})
  }))

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Maisory' })
  }))
})

test('Patching a document for a second time should only call fetch on doc store.', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: false })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 0)
})

test('Patching a document using a required version should cause the required version to be passed to the doc store.', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    mergePatch: {
      shortName: 'Maisory'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', expect.anything(), { custom: 'prop' }, { reqVersion: 'aaaa' }])
})

test('Fail to patch document when required version is not available.', async () => {
  const { sengi } = createSengiForTest({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    },
    reqVersion: 'aaaa' // if upsert yields VERSION_NOT_AVAILABLE and reqVersion is specified then versionNotAvailable error is raised
  })).rejects.toThrow(SengiRequiredVersionNotAvailableError)
})

test('Fail to patch document if it changes between fetch and upsert.', async () => {
  const { sengi } = createSengiForTest({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      shortName: 'Maisory'
    }
    // if upsert yields VERSION_NOT_AVAILABLE and reqVersion is NOT specified then conflictOnSave error is raised
  })).rejects.toThrow(SengiConflictOnSaveError)
})

test('Reject a patch to a non-existent doc.', async () => {
  const { sengi } = createSengiWithMockStore({
    fetch: async () => ({ doc: null })
  })

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-aaaaaaaaaaaa',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        shortName: 'Maisory'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocNotFoundError)
  }
})

test('Accept a patch to an unrecognised field although it has no effect.', async () => {
  const { sengi } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    mergePatch: {
      madeup: 'value'
    }
  })).resolves.toEqual({ isUpdated: true })
})

test('Reject a patch to any field that is not explicitly allowed for patching.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        pinCode: 4444
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(JSON.stringify(err)).toContain('canUpdate')
  }
})

test('Reject a patch with a field value that is given an invalid type.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        shortName: 123
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(JSON.stringify(err)).toContain('shortName')
    expect(JSON.stringify(err)).toContain('should be string')
  }
})

test('Reject a patch that would change a system field.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        id: 'aaaaaaaa-065a-4691-a7c8-2d84ec746ba9'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(JSON.stringify(err)).toContain('system field')
  }
})

test('Reject a patch that produces a doc that fails the docType validate function.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        addressLines: 'I live in a castle - which is not allowed'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocTypeValidateFunctionError)
    expect(err.message).toContain('No castle dwellers allowed')
  }
})

test('Fail to patch a document if permissions insufficient.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      mergePatch: {
        shortName: 'Maisory'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

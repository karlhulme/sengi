import { test, expect, jest } from '@jest/globals'
import {
  SengiConflictOnSaveError,
  SengiDocTypeValidateFunctionError,
  SengiDocNotFoundError,
  SengiInsufficientPermissionsError,
  SengiRequiredVersionNotAvailableError,
  DocStoreUpsertResultCode,
  DocStoreUpsertResult,
  SengiPatchValidationFailedError,
  SengiDocValidationFailedError
} from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTest = (upsertResponse?: DocStoreUpsertResult, sengiCtorOverrides?: Record<string, unknown>) => {
  return createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car',
        docVersion: 'aaaa',
        docOpIds: ['50e02b33-b22c-4207-8785-5a8aa529ec84'],
        manufacturer: 'ford',
        model: 'ka',
        registration: 'HG12 3AB'
      }
    })),
    upsert: jest.fn(async () => upsertResponse || ({ code: DocStoreUpsertResultCode.REPLACED }))
  }, sengiCtorOverrides)
}

test('Patching a document should call fetch and upsert on doc store, retaining existing properties (including unrecognised ones).', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    patch: {
      model: 'fiesta'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'car',
    docVersion: 'aaaa',
    docOpIds: ['50e02b33-b22c-4207-8785-5a8aa529ec84', '3ba01b5c-1ff1-481f-92f1-43d2060e11e7'],
    manufacturer: 'ford',
    model: 'fiesta',
    registration: 'HG12 3AB'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', resultDoc, { custom: 'prop' }, { reqVersion: 'aaaa' }])
})

test('Patching a document should invoke the onPreSaveDoc and onUpdateDoc delegates.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiForTest(undefined, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: jest.fn()
  })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    patch: {
      model: 'fiesta'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ model: 'fiesta'})
  }))

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], expect.objectContaining({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ model: 'fiesta' })
  }))
})

test('Patching a document with a known operation id should only call fetch on doc store.', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '50e02b33-b22c-4207-8785-5a8aa529ec84',
    patch: {
      model: 'fiesta'
    }
  })).resolves.toEqual({ isUpdated: false })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 0)
})

test('Patching a document using a required version should cause the required version to be passed to the doc store.', async () => {
  const { sengi, docStore } = createSengiForTest()

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    reqVersion: 'aaaa',
    patch: {
      model: 'fiesta'
    }
  })).resolves.toEqual({ isUpdated: true })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', expect.anything(), { custom: 'prop' }, { reqVersion: 'aaaa' }])
})

test('Fail to patch document when required version is not available.', async () => {
  const { sengi } = createSengiForTest({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    patch: {
      model: 'fiesta'
    },
    reqVersion: 'aaaa' // if upsert yields VERSION_NOT_AVAILABLE and reqVersion is specified then versionNotAvailable error is raised
  })).rejects.toThrow(SengiRequiredVersionNotAvailableError)
})

test('Fail to patch document if it changes between fetch and upsert.', async () => {
  const { sengi } = createSengiForTest({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    patch: {
      model: 'fiesta'
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
      id: '06151119-065a-4691-a7c8-aaaaaaaaaaaa',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
        model: 'fiesta'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocNotFoundError)
  }
})

test('Accept a patch to an unrecognised field if the json schema allows additional properties.', async () => {
  const { carDocType, sengi } = createSengiForTest()

  carDocType.jsonSchema.additionalProperties = true

  await expect(sengi.patchDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
    patch: {
      madeup: 'value'
    }
  })).resolves.toEqual({ isUpdated: true })
})

test('Reject a patch to any field that is not explicitly allowed for patching.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
        manufacturer: 'tesla'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiPatchValidationFailedError)
    expect(JSON.stringify(err)).toContain('Cannot patch readonly field')
  }
})

test('Reject a patch with a field value that is given an invalid type.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
        model: 123
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocValidationFailedError)
    expect(JSON.stringify(err)).toContain('model')
    expect(JSON.stringify(err)).toContain('should be string')
  }
})

test('Reject a patch that would change a system field.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
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
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
        registration: 'HZ12 3AB'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocTypeValidateFunctionError)
    expect(err.message).toContain('Unrecognised vehicle registration prefix')
  }
})

test('Fail to patch a document if permissions insufficient.', async () => {
  const { sengi } = createSengiForTest()

  try {
    await sengi.patchDocument({
      ...defaultRequestProps,
      roleNames: ['none'],
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      operationId: '3ba01b5c-1ff1-481f-92f1-43d2060e11e7',
      patch: {
        model: 'ka'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

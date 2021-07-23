import { test, expect, jest } from '@jest/globals'
import { DocStoreDeleteByIdResultCode, SengiInsufficientPermissionsError, SengiActionForbiddenByPolicyError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Delete document by id should call delete on doc store.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car'
      }
    })),
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.DELETED }))
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
  expect(docStore.deleteById).toHaveProperty('mock.calls.length', 1)
  expect(docStore.deleteById).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
})

test('Delete document by id should raise callbacks.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car'
      }
    })),
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.DELETED }))
  }, {
    onDeletedDoc: jest.fn()
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(sengiCtorOverrides.onDeletedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })
})

test('Deleting a non-existing document is not an error but the lack of deletion is reported.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: null
    })),
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }))
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: false })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
  expect(docStore.deleteById).toHaveProperty('mock.calls.length', 0)
})

test('Deleting a non-existing document is not an error but the lack of deletion is reported, even if the document is deleted between retrieval and instruction.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car'
      }
    })),
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }))
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: false })

  expect(docStore.fetch).toHaveProperty('mock.calls.length', 1)
  expect(docStore.fetch).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])

  expect(docStore.deleteById).toHaveProperty('mock.calls.length', 1)
  expect(docStore.deleteById).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
})

test('Fail to delete document if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to delete document if client api key is not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      apiKey: 'unknown',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

test('Fail to delete document if disallowed by policy.', async () => {
  const { carDocType, sengi } = createSengiWithMockStore()

  if (carDocType.policy) {
    carDocType.policy.canDeleteDocuments = false
  }

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
  }
})

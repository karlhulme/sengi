import { test, expect, jest } from '@jest/globals'
import { DocStoreDeleteByIdResultCode, SengiInsufficientPermissionsError, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Delete document by id should call delete on doc store.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.DELETED }))
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(docStore.deleteById).toHaveProperty('mock.calls.length', 1)
  expect(docStore.deleteById).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
})

test('Delete document by id should raise callbacks.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.DELETED }))
  }, {
    onDeletedDoc: jest.fn()
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(sengiCtorOverrides.onDeletedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })
})

test('Deleting a non-existing document is not an error but the lack of deletion is reported.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    deleteById: jest.fn(async() => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }))
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: false })

  expect(docStore.deleteById).toHaveProperty('mock.calls.length', 1)
  expect(docStore.deleteById).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }, {}])
})

test('Fail to delete document if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to delete document if disallowed by policy.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      docTypeName: 'car',
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
  }
})

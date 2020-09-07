import { test, expect, jest } from '@jest/globals'
import { successCodes } from '../consts'
import { SengiInsufficientPermissionsError } from '../errors'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Delete document by id should call delete on doc store.', async () => {
  const sengi = createSengiWithMockStore({
    deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_DELETED })
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(sengi._test.docStore.deleteById.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.deleteById.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Delete document by id should raise callbacks.', async () => {
  const sengi = createSengiWithMockStore({
    deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_DELETED })
  }, {
    onDeleteDoc: jest.fn()
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: true })

  expect(sengi._test.config.onDeleteDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })
})

test('Delete document by id should call delete on doc store even if document is not present.', async () => {
  const sengi = createSengiWithMockStore({
    deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_DID_NOT_EXIST })
  })

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).resolves.toEqual({ isDeleted: false })

  expect(sengi._test.docStore.deleteById.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.deleteById.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Fail to delete document if permissions insufficient.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.deleteDocument({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).rejects.toThrow(SengiInsufficientPermissionsError)
})

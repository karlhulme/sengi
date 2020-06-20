/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('jsonotron-errors')
const { successCodes } = require('../docStore')
const deleteDocument = require('./deleteDocument')

test('Delete document by id should call delete on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({ deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_DELETED }) })

  await expect(deleteDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isDeleted: true })

  expect(testRequest.mockedDocStore.deleteById.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.deleteById.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Delete document by id should raise callbacks.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({ deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_DELETED }) })

  const onDeleteDoc = jest.fn()

  await expect(deleteDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    reqProps: { foo: 'bar' },
    onDeleteDoc,
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isDeleted: true })

  expect(onDeleteDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })
})

test('Delete document by id should call delete on doc store even if document is not present.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({ deleteById: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_DID_NOT_EXIST }) })

  await expect(deleteDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docStoreOptions: { custom: 'prop' }
  })).resolves.toEqual({ isDeleted: false })

  expect(testRequest.mockedDocStore.deleteById.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.deleteById.mock.calls[0]).toEqual(['person', 'persons', '06151119-065a-4691-a7c8-2d84ec746ba9', {}, { custom: 'prop' }])
})

test('Fail to delete document if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(deleteDocument({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9'
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

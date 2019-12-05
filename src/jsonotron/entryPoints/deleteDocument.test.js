/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const deleteDocument = require('./deleteDocument')

test('Delete document by id should call delete on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({ deleteById: async () => ({}) })

  await expect(deleteDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docStoreOptions: { custom: 'prop' }
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.deleteById.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.deleteById.mock.calls[0]).toEqual(['person', '06151119-065a-4691-a7c8-2d84ec746ba9', { custom: 'prop' }])
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

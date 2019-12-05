/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const queryDocumentsByIds = require('./queryDocumentsByIds')

test('Query by document filter.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByIds: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const result = await queryDocumentsByIds({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9'],
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByIds.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByIds.mock.calls[0]).toEqual(['person', ['id', 'fullName'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], { custom: 'prop' }])
})

test('Query by document filter with onFieldsQueried delegate.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByIds: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const onFieldsQueriedDelegate = jest.fn()

  const result = await queryDocumentsByIds({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9'],
    onFieldsQueried: onFieldsQueriedDelegate,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByIds.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByIds.mock.calls[0]).toEqual(['person', ['id', 'fullName'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], { custom: 'prop' }])

  expect(onFieldsQueriedDelegate.mock.calls.length).toEqual(1)
  expect(onFieldsQueriedDelegate.mock.calls[0]).toEqual(['person', ['id', 'fullName'], ['id', 'fullName']])
})

test('Fail to query by document ids if permissions insufficient.', async () => {
  await expect(queryDocumentsByIds({
    ...createTestRequestWithMockedDocStore(),
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

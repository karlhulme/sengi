/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const queryDocumentsByIds = require('./queryDocumentsByIds')

test('Query by document filter.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByIds: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }
        ]
      }
    }
  })

  const result = await queryDocumentsByIds({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9'],
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    deprecations: {
      age: {
        reason: 'Use date of birth instead.'
      }
    },
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }
    ]
  })

  expect(testRequest.mockedDocStore.queryByIds.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByIds.mock.calls[0]).toEqual(['person', 'persons', ['id', 'fullName', 'age'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], {}, { custom: 'prop' }])
})

test('Query by document filter with onQueryDocs delegate.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByIds: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const onQueryDocsDelegate = jest.fn()

  const result = await queryDocumentsByIds({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9'],
    onQueryDocs: onQueryDocsDelegate,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    deprecations: {},
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByIds.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByIds.mock.calls[0]).toEqual(['person', 'persons', ['id', 'fullName'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], {}, { custom: 'prop' }])

  expect(onQueryDocsDelegate.mock.calls.length).toEqual(1)
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('roleNames', ['admin'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('reqProps', { meta: 'data' })
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('docType')
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('fieldNames', ['id', 'fullName'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('retrievalFieldNames', ['id', 'fullName'])
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

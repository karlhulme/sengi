/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const {
  JsonotronActionForbiddenByPolicyError,
  JsonotronInsufficientPermissionsError
} = require('../errors')
const queryDocuments = require('./queryDocuments')

test('Query all document of a type in collection.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryAll: async () => {
      return {
        docs: [
          { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
          { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
        ]
      }
    }
  })

  const result = await queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id'],
    onQueryDocs: null,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    deprecations: {},
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
    ]
  })

  expect(testRequest.mockedDocStore.queryAll.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryAll.mock.calls[0]).toEqual(['person', 'persons', ['id'], {}, { custom: 'prop' }])
})

test('Query all document of a type in collection with an onQueryDocs delegate.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryAll: async () => {
      return {
        docs: [
          { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
          { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
        ]
      }
    }
  })

  const onQueryDocsDelegate = jest.fn()

  const result = await queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id'],
    onQueryDocs: onQueryDocsDelegate,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    deprecations: {},
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
    ]
  })

  expect(testRequest.mockedDocStore.queryAll.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryAll.mock.calls[0]).toEqual(['person', 'persons', ['id'], {}, { custom: 'prop' }])

  expect(onQueryDocsDelegate.mock.calls.length).toEqual(1)
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('roleNames', ['admin'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('reqProps', { meta: 'data' })
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('docType')
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('fieldNames', ['id'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('retrievalFieldNames', ['id'])
})

test('Query all documents of a type with declared, calculated and default fields.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryAll: async () => {
      return {
        docs: [
          { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', shortName: 'Max', allowMarketing: 'no', addressLines: '24 Ryan Gardens\nFerndown', postCode: 'BH23 9KL', age: 22 },
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', shortName: 'Maisie', allowMarketing: 'yes', addressLines: '30 Ryan Gardens\nFerndown', postCode: 'BH23 4FG', age: 33 },
          { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', shortName: 'Dave', allowMarketing: 'no', addressLines: '11 Arcadia Close\nSalisbury', postCode: 'GU23 5GH', age: 44 }
        ]
      }
    }
  })

  const result = await queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'shortName', 'allowMarketing', 'fullAddress', 'age'],
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    deprecations: {
      age: {
        reason: 'Use date of birth instead.'
      }
    },
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', shortName: 'Max', allowMarketing: 'no', fullAddress: '24 Ryan Gardens\nFerndown\nBH23 9KL', age: 22 },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', shortName: 'Maisie', allowMarketing: 'yes', fullAddress: '30 Ryan Gardens\nFerndown\nBH23 4FG', age: 33 },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', shortName: 'Dave', allowMarketing: 'no', fullAddress: '11 Arcadia Close\nSalisbury\nGU23 5GH', age: 44 }
    ]
  })

  expect(testRequest.mockedDocStore.queryAll.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryAll.mock.calls[0]).toEqual(['person', 'persons', ['id', 'shortName', 'allowMarketing', 'addressLines', 'postCode', 'age'], {}, { custom: 'prop' }])
})

test('Query all documents with paging.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryAll: async () => {
      return {
        docs: [
          { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' }
        ]
      }
    }
  })

  await queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id'],
    limit: 1,
    docStoreOptions: { custom: 'prop' }
  })

  await queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id'],
    limit: 1,
    offset: 1,
    docStoreOptions: { custom: 'prop' }
  })

  expect(testRequest.mockedDocStore.queryAll.mock.calls.length).toEqual(2)
  expect(testRequest.mockedDocStore.queryAll.mock.calls[0]).toEqual(['person', 'persons', ['id'], { limit: 1 }, { custom: 'prop' }])
  expect(testRequest.mockedDocStore.queryAll.mock.calls[1]).toEqual(['person', 'persons', ['id'], { limit: 1, offset: 1 }, { custom: 'prop' }])
})

test('Fail to query all documents of type if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(queryDocuments({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id']
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('Fail to query all document of a type in collection if fetchWholeCollection is not allowed.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(queryDocuments({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'car',
    fieldNames: ['id']
  })).rejects.toThrow(JsonotronActionForbiddenByPolicyError)
})
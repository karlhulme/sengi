/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const {
  JsonotronUnrecognisedFilterNameError,
  JsonotronInsufficientPermissionsError
} = require('../errors')
const queryDocumentsByFilter = require('./queryDocumentsByFilter')

test('Query by document filter.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByFilter: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const result = await queryDocumentsByFilter({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    },
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByFilter.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0].length).toEqual(5)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][0]).toEqual('person')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][1]).toEqual('persons')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][2]).toEqual(['id', 'fullName'])
  expect(typeof testRequest.mockedDocStore.queryByFilter.mock.calls[0][3]).toEqual('function')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][4]).toEqual({ custom: 'prop' })
})

test('Query by document filter with onQueryDocs delegate.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByFilter: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const onQueryDocsDelegate = jest.fn()

  const result = await queryDocumentsByFilter({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    },
    onQueryDocs: onQueryDocsDelegate,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByFilter.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0].length).toEqual(5)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][0]).toEqual('person')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][1]).toEqual('persons')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][2]).toEqual(['id', 'fullName'])
  expect(typeof testRequest.mockedDocStore.queryByFilter.mock.calls[0][3]).toEqual('function')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][4]).toEqual({ custom: 'prop' })

  expect(onQueryDocsDelegate.mock.calls.length).toEqual(1)
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('roleNames', ['admin'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('reqProps', { userId: 'testUser' })
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('docType')
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('fieldNames', ['id', 'fullName'])
  expect(onQueryDocsDelegate.mock.calls[0][0]).toHaveProperty('retrievalFieldNames', ['id', 'fullName'])
})

test('Fail to query by document filter if filter name not recognised.', async () => {
  await expect(queryDocumentsByFilter({
    ...createTestRequestWithMockedDocStore(),
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byInvalid',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).rejects.toThrow(JsonotronUnrecognisedFilterNameError)
})

test('Fail to query by document filter if permissions insufficient.', async () => {
  await expect(queryDocumentsByFilter({
    ...createTestRequestWithMockedDocStore(),
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

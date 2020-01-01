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
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0].length).toEqual(4)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][0]).toEqual('person')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][1]).toEqual(['id', 'fullName'])
  expect(typeof testRequest.mockedDocStore.queryByFilter.mock.calls[0][2]).toEqual('function')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][3]).toEqual({ custom: 'prop' })
})

test('Query by document filter with onFieldsQueried delegate.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    queryByFilter: async () => {
      return {
        docs: [
          { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
        ]
      }
    }
  })

  const onFieldsQueriedDelegate = jest.fn()

  const result = await queryDocumentsByFilter({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    },
    onFieldsQueried: onFieldsQueriedDelegate,
    docStoreOptions: { custom: 'prop' }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })

  expect(testRequest.mockedDocStore.queryByFilter.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0].length).toEqual(4)
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][0]).toEqual('person')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][1]).toEqual(['id', 'fullName'])
  expect(typeof testRequest.mockedDocStore.queryByFilter.mock.calls[0][2]).toEqual('function')
  expect(testRequest.mockedDocStore.queryByFilter.mock.calls[0][3]).toEqual({ custom: 'prop' })

  expect(onFieldsQueriedDelegate.mock.calls.length).toEqual(1)
  expect(onFieldsQueriedDelegate.mock.calls[0]).toEqual(['person', ['id', 'fullName'], ['id', 'fullName']])
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

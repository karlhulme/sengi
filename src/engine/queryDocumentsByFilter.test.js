import { test, expect, jest } from '@jest/globals'
import { createJsonotronWithMockStore, defaultRequestProps } from './shared.test'
import { JsonotronUnrecognisedFilterNameError, JsonotronInsufficientPermissionsError } from '../jsonotron-errors'

test('Query by document filter with support for paging.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    queryByFilter: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }] })
  })

  await expect(jsonotron.queryDocumentsByFilter({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    },
    limit: 1,
    offset: 2
  })).resolves.toEqual({
    deprecations: {
      age: {
        reason: 'This field has been deprecated.'
      }
    },
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }
    ]
  })

  expect(jsonotron._test.docStore.queryByFilter.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.queryByFilter.mock.calls[0]).toEqual(['person', 'persons', ['id', 'fullName', 'age'], expect.any(Function), { limit: 1, offset: 2 }, { custom: 'prop' }])
})

test('Query by document filter with onQueryDocs delegate and without paging.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    queryByFilter: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }] })
  }, {
    onQueryDocs: jest.fn()
  })

  await expect(jsonotron.queryDocumentsByFilter({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).resolves.toBeDefined()

  expect(jsonotron._test.docStore.queryByFilter.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.queryByFilter.mock.calls[0]).toEqual(['person', 'persons', ['id', 'fullName', 'age'], expect.any(Function), {}, { custom: 'prop' }])

  expect(jsonotron._test.config.onQueryDocs.mock.calls.length).toEqual(1)
  expect(jsonotron._test.config.onQueryDocs.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'fullName', 'age'],
    retrievalFieldNames: ['id', 'fullName', 'age']
  }])
})

test('Fail to query by document filter if filter name not recognised.', async () => {
  const jsonotron = createJsonotronWithMockStore()

  await expect(jsonotron.queryDocumentsByFilter({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id'],
    filterName: 'byInvalid',
    filterParams: {}
  })).rejects.toThrow(JsonotronUnrecognisedFilterNameError)
})

test('Fail to query by document filter if permissions insufficient.', async () => {
  const jsonotron = createJsonotronWithMockStore()

  await expect(jsonotron.queryDocumentsByFilter({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    fieldNames: ['id'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

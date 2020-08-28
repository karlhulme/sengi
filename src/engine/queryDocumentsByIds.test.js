/* eslint-env jest */
const { createJsonotronWithMockStore, defaultRequestProps } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('jsonotron-errors')

test('Query by document ids.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    queryByIds: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }] })
  })

  await expect(jsonotron.queryDocumentsByIds({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toEqual({
    deprecations: {
      age: {
        reason: 'This field has been deprecated.'
      }
    },
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }
    ]
  })

  expect(jsonotron._test.docStore.queryByIds.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.queryByIds.mock.calls[0]).toEqual(['person', 'persons', ['id', 'fullName', 'age'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], {}, { custom: 'prop' }])
})

test('Query by document ids using a onQueryDocs delegate.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    queryByIds: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }] })
  }, {
    onQueryDocs: jest.fn()
  })

  await expect(jsonotron.queryDocumentsByIds({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toBeDefined()

  expect(jsonotron._test.config.onQueryDocs.mock.calls.length).toEqual(1)
  expect(jsonotron._test.config.onQueryDocs.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'fullName', 'age'],
    retrievalFieldNames: ['id', 'fullName', 'age']
  }])
})

test('Fail to query by document ids if permissions insufficient.', async () => {
  const jsonotron = createJsonotronWithMockStore()

  await expect(jsonotron.queryDocumentsByIds({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

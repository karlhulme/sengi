import { test, expect, jest } from '@jest/globals'
import { SengiUnrecognisedFilterNameError, SengiInsufficientPermissionsError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Query by document filter with support for paging.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    queryByFilter: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }] }))
  })

  await expect(sengi.queryDocumentsByFilter({
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
        reason: 'Use DOB instead'
      }
    },
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }
    ]
  })

  expect(docStore.queryByFilter).toHaveProperty('mock.calls.length', 1)
  expect(docStore.queryByFilter).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', ['id', 'fullName', 'age'], expect.any(Function), { custom: 'prop' }, { limit: 1, offset: 2 }])
})

test('Query by document filter with onPreQueryDocs delegate and without paging.', async () => {
  const {sengi, sengiCtorOverrides, docStore } = createSengiWithMockStore({
    queryByFilter: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 60 }] }))
  }, {
    onPreQueryDocs: jest.fn()
  })

  await expect(sengi.queryDocumentsByFilter({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).resolves.toBeDefined()

  expect(docStore.queryByFilter).toHaveProperty('mock.calls.length', 1)
  expect(docStore.queryByFilter).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', ['id', 'fullName', 'age'], expect.any(Function), { custom: 'prop' }, {}])

  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty(['mock', 'calls', '0', '0'], { 
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'fullName', 'age'],
    retrievalFieldNames: ['id', 'fullName', 'age']
  })
})

test('Fail to query by document filter if filter name not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.queryDocumentsByFilter({
      ...defaultRequestProps,
      docTypeName: 'person',
      fieldNames: ['id'],
      filterName: 'byInvalid',
      filterParams: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedFilterNameError)
  }
})

test('Fail to query by document filter if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.queryDocumentsByFilter({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      fieldNames: ['id'],
      filterName: 'byPostCode',
      filterParams: {
        postCode: 'BH23 4FG'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

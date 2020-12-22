import { test, expect, jest } from '@jest/globals'
import { SengiActionForbiddenByPolicyError, SengiInsufficientPermissionsError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTests = (sengiCtorOverrides?: Record<string, unknown>) => {
  return createSengiWithMockStore({
    queryAll: jest.fn(async () => ({
      docs: [
        { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', shortName: 'Max', allowMarketing: 'no', addressLines: '24 Ryan Gardens\nFerndown', postCode: 'BH23 9KL', age: 22 },
        { id: '06151119-065a-4691-a7c8-2d84ec746ba9', shortName: 'Maisie', allowMarketing: 'yes', addressLines: '30 Ryan Gardens\nFerndown', postCode: 'BH23 4FG', age: 33 },
        { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', shortName: 'Dave', allowMarketing: 'no', addressLines: '11 Arcadia Close\nSalisbury', postCode: 'GU23 5GH', age: 44 }
      ]
    }))
  }, sengiCtorOverrides)
}

test('Query for all documents of a type in a collection with support for paging.', async () => {
  const { sengi, docStore } = createSengiForTests()

  await expect(sengi.queryDocuments({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id'],
    offset: 1,
    limit: 3
  })).resolves.toEqual({
    deprecations: {},
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
    ]
  })

  expect(docStore.queryAll).toHaveProperty('mock.calls.length', 1)
  expect(docStore.queryAll).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', ['id'], { custom: 'prop' }, { offset: 1, limit: 3 }])
})

test('Query for all documents of a type in a collection with an onQueryDocs delegate but without paging.', async () => {
  const { sengi, docStore, sengiCtorOverrides } = createSengiForTests({
    onPreQueryDocs: jest.fn()
  })

  await expect(sengi.queryDocuments({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id']
  })).resolves.toBeDefined()

  expect(docStore.queryAll).toHaveProperty('mock.calls.length', 1)
  expect(docStore.queryAll).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', ['id'], { custom: 'prop' }, {}])

  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id'],
    retrievalFieldNames: ['id']
  })
})

test('Query for all documents of a type with declared, calculated and default fields.', async () => {
  const { sengi } = createSengiForTests()

  await expect(sengi.queryDocuments({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'shortName', 'allowMarketing', 'fullAddress', 'age']
  })).resolves.toEqual({
    deprecations: {
      age: {
        reason: 'Use DOB instead'
      }
    },
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', shortName: 'Max', allowMarketing: 'no', fullAddress: '24 Ryan Gardens\nFerndown\nBH23 9KL', age: 22 },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', shortName: 'Maisie', allowMarketing: 'yes', fullAddress: '30 Ryan Gardens\nFerndown\nBH23 4FG', age: 33 },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', shortName: 'Dave', allowMarketing: 'no', fullAddress: '11 Arcadia Close\nSalisbury\nGU23 5GH', age: 44 }
    ]
  })
})

test('Fail to query all documents of type if permissions insufficient.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.queryDocuments({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to query all document of a type in collection if fetchWholeCollection is not allowed.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.queryDocuments({
      ...defaultRequestProps,
      docTypeName: 'car',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
  }
})

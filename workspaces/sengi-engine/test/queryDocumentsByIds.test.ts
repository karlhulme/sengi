import { test, expect, jest } from '@jest/globals'
import { SengiInsufficientPermissionsError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Query by document ids.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    queryByIds: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }] }))
  })

  await expect(sengi.queryDocumentsByIds({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toEqual({
    deprecations: {
      age: {
        reason: 'Use DOB instead'
      }
    },
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }
    ]
  })

  expect(docStore.queryByIds).toHaveProperty('mock.calls.length', 1)
  expect(docStore.queryByIds).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', ['id', 'fullName', 'age'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], { custom: 'prop' }, {}])
})

test('Query by document ids using a onPreQueryDocs delegate.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    queryByIds: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion', age: 25 }] })
  }, {
    onPreQueryDocs: jest.fn()
  })

  await expect(sengi.queryDocumentsByIds({
    ...defaultRequestProps,
    docTypeName: 'person',
    fieldNames: ['id', 'fullName', 'age', 'fullAddress'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toBeDefined()

  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreQueryDocs).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'fullName', 'age', 'fullAddress'],
    retrievalFieldNames: ['id', 'fullName', 'age', 'addressLines', 'postCode']
  })
})

test('Fail to query by document ids if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.queryDocumentsByIds({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      fieldNames: ['id', 'fullName'],
      ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

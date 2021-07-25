import { test, expect, jest } from '@jest/globals'
import { SengiActionForbiddenByPolicyError, SengiInsufficientPermissionsError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTests = (sengiCtorOverrides?: Record<string, unknown>) => {
  return createSengiWithMockStore({
    selectAll: jest.fn(async () => ({
      docs: [
        { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' },
        { id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'tesla', model: 'T', registration: 'HG12 4CD' },
        { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', manufacturer: 'mini', model: 'cooper', registration: 'HG12 5EF' },
      ]
    }))
  }, sengiCtorOverrides)
}

test('Select all documents of a type in a collection with support for paging.', async () => {
  const { sengi, docStore } = createSengiForTests()

  await expect(sengi.selectDocuments({
    ...defaultRequestProps,
    fieldNames: ['id', 'model'], // the test doc store 'selectAll' implementation above will not respect this
    offset: 1,
    limit: 3
  })).resolves.toEqual({
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'tesla', model: 'T', registration: 'HG12 4CD' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', manufacturer: 'mini', model: 'cooper', registration: 'HG12 5EF' },
  ]
  })

  expect(docStore.selectAll).toHaveProperty('mock.calls.length', 1)
  expect(docStore.selectAll).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', ['id', 'model'], { custom: 'prop' }, { offset: 1, limit: 3 }])
})

test('Select all documents of a type in a collection with an onSelectDocs delegate but without paging.', async () => {
  const { sengi, docStore, sengiCtorOverrides } = createSengiForTests({
    onPreSelectDocs: jest.fn()
  })

  await expect(sengi.selectDocuments({
    ...defaultRequestProps,
    fieldNames: ['id']
  })).resolves.toBeDefined()

  expect(docStore.selectAll).toHaveProperty('mock.calls.length', 1)
  expect(docStore.selectAll).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', ['id'], { custom: 'prop' }, {}])

  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id'],
    user: {}
  })
})

test('Fail to select all documents of type if permissions insufficient.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.selectDocuments({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to select all documents of type if client api key is not recognised.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.selectDocuments({
      ...defaultRequestProps,
      apiKey: 'unknown',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

test('Fail to select all documents of a type in collection if fetchWholeCollection is not allowed.', async () => {
  const { carDocType, sengi } = createSengiForTests()

  if (carDocType.policy) {
    carDocType.policy.canFetchWholeCollection = false
  }

  try {
    await sengi.selectDocuments({
      ...defaultRequestProps,
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
  }
})

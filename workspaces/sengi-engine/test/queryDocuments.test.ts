import { test, expect, jest } from '@jest/globals'
import { SengiInsufficientPermissionsError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createSengiForTests = (sengiCtorOverrides?: Record<string, unknown>) => {
  return createSengiWithMockStore({
    query: jest.fn(async () => ({ data: 5 }))
  }, sengiCtorOverrides)
}

test('Execute a query on a document collection.', async () => {
  const { sengi, docStore } = createSengiForTests()

  await expect(sengi.queryDocuments({
    ...defaultRequestProps,
    queryName: 'count',
    queryParams: 'ALL'
  })).resolves.toEqual({ data: 5 })

  expect(docStore.query).toHaveProperty('mock.calls.length', 1)
  expect(docStore.query).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', 'COUNT ALL', { custom: 'prop' }, {}])
})

test('Fail to execute query if permissions insufficient.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.queryDocuments({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      queryName: 'count',
      queryParams: 'ALL'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to execute query if client api key is not recognised.', async () => {
  const { sengi } = createSengiForTests()

  try {
    await sengi.queryDocuments({
      ...defaultRequestProps,
      apiKey: 'unknown',
      queryName: 'count',
      queryParams: 'ALL'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

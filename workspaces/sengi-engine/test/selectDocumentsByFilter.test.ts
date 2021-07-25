import { test, expect, jest } from '@jest/globals'
import { SengiUnrecognisedFilterNameError, SengiInsufficientPermissionsError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Select by document filter with support for paging.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    selectByFilter: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }] }))
  })

  await expect(sengi.selectDocumentsByFilter({
    ...defaultRequestProps,
    fieldNames: ['id', 'model'], // the test doc store 'selectByFilter' implementation above will not respect this
    filterName: 'byModel',
    filterParams: 'ka',
    limit: 1,
    offset: 2
  })).resolves.toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }
    ]
  })

  expect(docStore.selectByFilter).toHaveProperty('mock.calls.length', 1)
  expect(docStore.selectByFilter).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', ['id', 'model'], 'MODEL=ka', { custom: 'prop' }, { limit: 1, offset: 2 }])
})

test('Select by document filter with onPreSelectDocs delegate and without paging.', async () => {
  const {sengi, sengiCtorOverrides, docStore } = createSengiWithMockStore({
    selectByFilter: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }] }))
  }, {
    onPreSelectDocs: jest.fn()
  })

  await expect(sengi.selectDocumentsByFilter({
    ...defaultRequestProps,
    fieldNames: ['id', 'model'],
    filterName: 'byModel',
    filterParams: 'ka'
  })).resolves.toBeDefined()

  expect(docStore.selectByFilter).toHaveProperty('mock.calls.length', 1)
  expect(docStore.selectByFilter).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', ['id', 'model'], 'MODEL=ka', { custom: 'prop' }, { limit: undefined, offset: undefined }])

  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'model'],
    user: {}
  })
})

test('Fail to select by document filter if filter name not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.selectDocumentsByFilter({
      ...defaultRequestProps,
      fieldNames: ['id'],
      filterName: 'byInvalid',
      filterParams: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedFilterNameError)
  }
})

test('Fail to select by document filter if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.selectDocumentsByFilter({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      fieldNames: ['id'],
      filterName: 'byModel',
      filterParams: 'ka'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to select by document filter if client api key is not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.selectDocumentsByFilter({
      ...defaultRequestProps,
      apiKey: 'unknown',
      fieldNames: ['id'],
      filterName: 'byModel',
      filterParams: 'ka'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

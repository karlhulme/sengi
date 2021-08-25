import { test, expect, jest } from '@jest/globals'
import { SengiInsufficientPermissionsError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Select by document ids.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    selectByIds: jest.fn(async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }] }))
  })

  await expect(sengi.selectDocumentsByIds({
    ...defaultRequestProps,
    fieldNames: ['id', 'model'], // the test doc store 'selectByIds' implementation above will not respect this
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }
    ]
  })

  expect(docStore.selectByIds).toHaveProperty('mock.calls.length', 1)
  expect(docStore.selectByIds).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', ['id', 'model'], ['06151119-065a-4691-a7c8-2d84ec746ba9'], { custom: 'prop' }, {}])
})

test('Select by document ids using a onPreSelectDocs delegate.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    selectByIds: async () => ({ docs: [{ id: '06151119-065a-4691-a7c8-2d84ec746ba9', manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }] })
  }, {
    onPreSelectDocs: jest.fn()
  })

  await expect(sengi.selectDocumentsByIds({
    ...defaultRequestProps,
    fieldNames: ['id', 'model'],
    ids: ['06151119-065a-4691-a7c8-2d84ec746ba9']
  })).resolves.toBeDefined()

  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSelectDocs).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.anything(),
    fieldNames: ['id', 'model'],
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })
})

test('Fail to select by document ids if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.selectDocumentsByIds({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      fieldNames: ['id', 'model'],
      ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to select by document ids if client api key is not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.selectDocumentsByIds({
      ...defaultRequestProps,
      apiKey: 'unknown',
      fieldNames: ['id', 'model'],
      ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

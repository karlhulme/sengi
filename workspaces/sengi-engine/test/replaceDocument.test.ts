import { test, expect, jest } from '@jest/globals'
import {
  SengiActionForbiddenByPolicyError,
  SengiDocTypeValidateFunctionError,
  SengiInsufficientPermissionsError,
  SengiDocValidationFailedError,
  DocStoreUpsertResultCode,
  SengiUnrecognisedApiKeyError
} from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createNewDocument = () => ({
  id: '06151119-065a-4691-a7c8-2d84ec746ba9',
  docType: 'car',
  manufacturer: 'ford',
  model: 'ka',
  registration: 'HG12 3AB'
})

test('Replacing a document should call upsert on the doc store.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.REPLACED }))
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'car',
    docCreatedByUserId: 'user-0001',
    docCreatedMillisecondsSinceEpoch: 1629881470000,
    docLastUpdatedByUserId: 'user-0001',
    docLastUpdatedMillisecondsSinceEpoch: 1629881470000,
    docOpIds: [],
    manufacturer: 'ford',
    model: 'ka',
    registration: 'HG12 3AB'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', resultDoc, { custom: 'prop' } , {}])
})

test('Replacing a document should raise the onPreSaveDoc and onSavedDoc delegates.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    upsert: async () => ({ code: DocStoreUpsertResultCode.REPLACED })
  }, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: jest.fn()
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ model: 'ka' }),
    isNew: null,
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ model: 'ka' }),
    isNew: false,
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })
})

test('Replacing a non-existent document should raise the onSavedDoc delegate.', async () => {
  const { sengi, docStore, sengiCtorOverrides } = createSengiWithMockStore({
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  }, {
    onSavedDoc: jest.fn()
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: true })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ model: 'ka' }),
    isNew: true,
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'car',
    docCreatedByUserId: 'user-0001',
    docCreatedMillisecondsSinceEpoch: 1629881470000,
    docLastUpdatedByUserId: 'user-0001',
    docLastUpdatedMillisecondsSinceEpoch: 1629881470000,
    docOpIds: [],
    manufacturer: 'ford',
    model: 'ka',
    registration: 'HG12 3AB'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', resultDoc, { custom: 'prop' }, {}])
})

test('Fail to replace a document if it does not conform to the doc type schema.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      doc: {
        ...createNewDocument(),
        model: 123 // rather than a string
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocValidationFailedError)
  }
})

test('Fail to replace a document if it fails custom validation.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      doc: {
        ...createNewDocument(),
        registration: 'HZ12 3AB' // registration must begin HG
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocTypeValidateFunctionError)
  }
})

test('Fail to replace a document if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      doc: createNewDocument()
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to replace a document if client api key is not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      apiKey: 'unknown',
      doc: createNewDocument()
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

test('Fail to replace a document if disallowed by doc type policy.', async () => {
  const { carDocType, sengi } = createSengiWithMockStore({
    upsert: async () => ({ code: DocStoreUpsertResultCode.CREATED })
  })

  if (carDocType.policy) {
    carDocType.policy.canReplaceDocuments = false
  }

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car',
        docVersion: 'aaaa',
        manufacturer: 'Honda',
        model: 'Accord',
        registration: 'HG67 8HJ',
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
  }
})

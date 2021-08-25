import { test, expect, jest } from '@jest/globals'
import { DocStoreUpsertResultCode, SengiDocTypeValidateFunctionError, SengiInsufficientPermissionsError, SengiUnrecognisedApiKeyError } from 'sengi-interfaces'
import { asError } from '../src/utils'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const newCar = {
  manufacturer: 'ford',
  model: 'ka',
  registration: 'HG12 3AB'
}

test('Adding a new document should call exists and then upsert on doc store.', async () => {
  const { docStore, sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: newCar 
  })).resolves.toEqual({ isNew: true })

  expect(docStore.exists).toHaveProperty('mock.calls.length', 1)
  expect(docStore.exists).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', { custom: 'prop' }, {}])

  const resultDoc = {
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docType: 'car',
    docOpIds: [],
    docCreatedByUserId: 'user-0001',
    docCreatedMillisecondsSinceEpoch: 1629881470000,
    docLastUpdatedByUserId: 'user-0001',
    docLastUpdatedMillisecondsSinceEpoch: 1629881470000,

    // fields
    manufacturer: 'ford',
    model: 'ka',
    registration: 'HG12 3AB'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['car', 'cars', resultDoc, { custom: 'prop' }, {}])
})

test('Adding a new document should cause the onPreSaveDoc and onSavedDoc events to be invoked.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  }, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: jest.fn()
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    docTypeName: 'car',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: newCar
  })).resolves.toEqual({ isNew: true })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }),
    isNew: true,
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    clientName: 'admin',
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ name: 'car' }),
    doc: expect.objectContaining({ manufacturer: 'ford', model: 'ka', registration: 'HG12 3AB' }),
    isNew: true,
    user: {
      userId: 'user-0001',
      username: 'testUser'
    }
  })
})

test('Adding a new document that already exists should not lead to a call to upsert.', async () => {
  const { docStore, sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: true })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: newCar
  })).resolves.toEqual({ isNew: false })

  expect(docStore.exists).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty('mock.calls.length', 0)
})

test('Fail to add a new document that does not pass validation.', async () => {
  const { docStore, sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: { ...newCar, registration: 'HZ12 3AB' }
  })).rejects.toThrow(asError(SengiDocTypeValidateFunctionError))

  expect(docStore.exists).toHaveProperty('mock.calls.length', 1)
})

test('Fail to add a new document if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      apiKey: 'noneKey',
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: newCar
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to add a new document if client api key is not recognised.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      apiKey: 'unknown',
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: newCar
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedApiKeyError)
  }
})

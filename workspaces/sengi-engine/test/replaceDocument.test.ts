import { test, expect, jest } from '@jest/globals'
import {
  SengiActionForbiddenByPolicyError,
  SengiDocTypeValidateFunctionError,
  SengiInsufficientPermissionsError,
  SengiDocValidationFailedError,
  DocStoreUpsertResultCode
} from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const createNewDocument = () => ({
  id: '06151119-065a-4691-a7c8-2d84ec746ba9',
  docType: 'person',
  tenantId: 'companyA',
  shortName: 'Francesco',
  fullName: 'Francesco Speedio',
  dateOfBirth: '2010-11-05',
  favouriteColors: ['orange', 'purple']
})

test('Replacing a document should call upsert on the doc store.', async () => {
  const { sengi, docStore } = createSengiWithMockStore({
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.REPLACED }))
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    ...createNewDocument(),
    fullAddress: '',
    displayName: 'Francesco'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', resultDoc, { custom: 'prop' } , {}])
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
    docTypeName: 'person',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' }),
    isNew: null
  })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' }),
    isNew: false
  })
})

test('Replacing a non-existent document and retaining unrecognised fields and raising onSavedDoc delegate.', async () => {
  const { sengi, docStore, sengiCtorOverrides } = createSengiWithMockStore({
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  }, {
    onSavedDoc: jest.fn()
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: {
      ...createNewDocument(),
      unrecognisedProperty: 'unrecognisedValue'
    }
  })).resolves.toEqual({ isNew: true })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty('mock.calls.length', 1)
  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', unrecognisedProperty: 'unrecognisedValue' }),
    isNew: true
  })

  const resultDoc = {
    ...createNewDocument(),
    unrecognisedProperty: 'unrecognisedValue',
    fullAddress: '',
    displayName: 'Francesco'
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', resultDoc, { custom: 'prop' }, {}])
})

test('Fail to replace a document if it does not conform to the doc type schema.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      doc: {
        ...createNewDocument(),
        tenantId: 505 // rather than a string
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
      docTypeName: 'person',
      doc: {
        ...createNewDocument(),
        addressLines: 'i live in a castle' // address lines containing 'castle' are rejected
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
      docTypeName: 'person',
      doc: createNewDocument(),
      roleNames: ['none']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

test('Fail to replace a document if disallowed by doc type policy.', async () => {
  const { sengi } = createSengiWithMockStore({
    upsert: async () => ({ code: DocStoreUpsertResultCode.CREATED })
  })

  try {
    await sengi.replaceDocument({
      ...defaultRequestProps,
      docTypeName: 'car',
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

import { test, expect, jest } from '@jest/globals'
import {
  SengiActionForbiddenByPolicyError,
  SengiDocumentCustomValidationError,
  SengiInsufficientPermissionsError,
  SengiRequiredVersionNotAvailableError,
  SengiDocTypeInstanceValidationFailedError
} from '../errors'
import { errorCodes, successCodes } from '../consts'
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

const createExpectedDocHeader = () => ({
  origin: {
    userIdentity: 'testUser',
    dateTime: '2020-01-01T14:22:03Z'
  },
  updated: {
    userIdentity: 'testUser',
    dateTime: '2020-01-01T14:22:03Z'
  },
  ops: [],
  calcs: {
    displayName: {
      value: 'Francesco'
    },
    fullAddress: {
      value: ''
    }
  }
})

test('Replacing a document should call upsert on the doc store.', async () => {
  const sengi = createSengiWithMockStore({
    upsert: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_REPLACED })
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    ...createNewDocument(),
    docHeader: createExpectedDocHeader()
  }

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, {}, { custom: 'prop' }])
})

test('Replacing a document should raise the onPreSaveDoc and onUpdateDoc delegates.', async () => {
  const sengi = createSengiWithMockStore({
    upsert: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_REPLACED })
  }, {
    onPreSaveDoc: jest.fn(),
    onUpdateDoc: jest.fn()
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: createNewDocument()
  })).resolves.toEqual({ isNew: false })

  expect(sengi._test.config.onPreSaveDoc.mock.calls.length).toEqual(1)
  expect(sengi._test.config.onPreSaveDoc.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' }),
    mergePatch: null
  }])

  expect(sengi._test.config.onUpdateDoc.mock.calls.length).toEqual(1)
  expect(sengi._test.config.onUpdateDoc.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', tenantId: 'companyA' })
  }])
})

test('Replacing a document with a required version should cause the required version to be passed to the doc store.', async () => {
  const sengi = createSengiWithMockStore({
    upsert: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_REPLACED })
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: createNewDocument(),
    reqVersion: 'aaaa'
  })).resolves.toEqual({ isNew: false })

  const resultDoc = {
    ...createNewDocument(),
    docHeader: createExpectedDocHeader()
  }

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, { reqVersion: 'aaaa' }, { custom: 'prop' }])
})

test('Replacing a non-existent document and retaining unrecognised fields and raising onCreateDoc delegate.', async () => {
  const sengi = createSengiWithMockStore({
    upsert: async () => ({ successCode: successCodes.DOC_STORE_DOCUMENT_WAS_CREATED })
  }, {
    onCreateDoc: jest.fn()
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: {
      ...createNewDocument(),
      unrecognisedProperty: 'unrecognisedValue'
    }
  })).resolves.toEqual({ isNew: true })

  const resultDoc = {
    ...createNewDocument(),
    docHeader: createExpectedDocHeader(),
    unrecognisedProperty: 'unrecognisedValue'
  }

  expect(sengi._test.config.onCreateDoc.mock.calls.length).toEqual(1)
  expect(sengi._test.config.onCreateDoc.mock.calls[0]).toEqual([{
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Francesco', fullName: 'Francesco Speedio', unrecognisedProperty: 'unrecognisedValue' })
  }])

  expect(sengi._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(sengi._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, {}, { custom: 'prop' }])
})

test('Fail to replace a document with an unavailable required version.', async () => {
  const sengi = createSengiWithMockStore({
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    doc: createNewDocument(),
    docTypeName: 'person',
    reqVersion: 'aaaa'
  })).rejects.toThrow(SengiRequiredVersionNotAvailableError)
})

test('Fail to replace a document if it does not conform to the doc type schema.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: {
      ...createNewDocument(),
      tenantId: 505 // rather than a string
    }
  })).rejects.toThrow(SengiDocTypeInstanceValidationFailedError)
})

test('Fail to replace a document if it fails custom validation.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: {
      ...createNewDocument(),
      addressLines: 'i live in a castle' // address lines containing 'castle' are rejected
    }
  })).rejects.toThrow(SengiDocumentCustomValidationError)
})

test('Fail to replace a document if permissions insufficient.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    doc: createNewDocument(),
    roleNames: ['none']
  })).rejects.toThrow(SengiInsufficientPermissionsError)
})

test('Fail to replace a document if disallowed by doc type policy.', async () => {
  const sengi = createSengiWithMockStore()

  await expect(sengi.replaceDocument({
    ...defaultRequestProps,
    roleNames: ['admin'],
    docTypeName: 'car',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'car',
      docVersion: 'aaaa',
      manufacturer: 'Honda',
      model: 'Accord',
      registration: 'HG67 8HJ'
    }
  })).rejects.toThrow(SengiActionForbiddenByPolicyError)
})

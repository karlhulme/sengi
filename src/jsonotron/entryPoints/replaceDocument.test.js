/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const {
  JsonotronActionForbiddenByPolicyError,
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronRequiredVersionNotAvailableError
} = require('../errors')
const { errorCodes } = require('../docStore')
const replaceDocument = require('./replaceDocument')

test('Replacing a document should call upsert on the doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({})
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      docVersion: 'aaaa',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.not.toThrow()

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docOps: [],
    docVersion: 'aaaa',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, null, { custom: 'prop' }])
})

test('Replacing a document with a required version should call upsert on the doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({})
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    reqVersion: 'aaaa',
    docStoreOptions: { custom: 'prop' }
  })).resolves.not.toThrow()

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docOps: [],
    docVersion: 'bbbb',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to replace a document with an unavailable required version.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    upsert: async () => ({ errorCode: errorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE })
  })

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    },
    reqVersion: 'aaaa',
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)

  const resultDoc = {
    id: '06151119-065a-4691-a7c8-2d84ec746ba9',
    docType: 'person',
    docOps: [],
    docVersion: 'bbbb',
    tenantId: 'companyA',
    shortName: 'Francesco',
    fullName: 'Francesco Speedio',
    dateOfBirth: '2010-11-05',
    favouriteColors: ['orange', 'purple']
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, 'aaaa', { custom: 'prop' }])
})

test('Fail to replace a document if it does not conform to the doc type schema.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple'],
      madeupProperty: 'madeupValue'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronDocumentFieldsValidationError)
})

test('Fail to replace a document if it fails custom validation.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      docVersion: 'bbbb',
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple'],
      addressLines: 'i live in a castle'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronDocumentCustomValidationError)
})

test('Fail to replace a document if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['invalid'],
    docTypeName: 'person',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'person',
      docOps: [],
      tenantId: 'companyA',
      shortName: 'Francesco',
      fullName: 'Francesco Speedio',
      dateOfBirth: '2010-11-05',
      favouriteColors: ['orange', 'purple']
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('Fail to replace a document if disallowed by doc type policy.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(replaceDocument({
    ...testRequest,
    roleNames: ['admin'],
    docTypeName: 'car',
    doc: {
      id: '06151119-065a-4691-a7c8-2d84ec746ba9',
      docType: 'car',
      docOps: [],
      docVersion: 'aaaa',
      manufacturer: 'Honda',
      model: 'Accord',
      registration: 'HG67 8HJ'
    },
    docStoreOptions: { custom: 'prop' }
  })).rejects.toThrow(JsonotronActionForbiddenByPolicyError)
})

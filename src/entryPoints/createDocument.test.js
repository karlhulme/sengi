/* eslint-env jest */
const { createTestRequestWithMockedDocStore } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const createDocument = require('./createDocument')

test('Creating a document should call exists and then upsert on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    exists: async () => ({ found: false }),
    upsert: async () => ({})
  })

  await expect(createDocument({
    ...testRequest,
    roleNames: ['admin'],
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docTypeName: 'person',
    constructorParams: {
      shortName: 'Donald',
      fullName: 'Donald Fresh',
      dateOfBirth: '2000-01-02',
      askedAboutMarketing: true
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.exists.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.exists.mock.calls[0]).toEqual(['person', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', { custom: 'prop' }])

  const resultDoc = {
    allowMarketing: 'yes',
    dateOfBirth: '2000-01-02',
    docOps: [],
    docType: 'person',
    fullName: 'Donald Fresh',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    shortName: 'Donald',
    tenantId: 'companyA'
  }

  expect(testRequest.mockedDocStore.upsert.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.upsert.mock.calls[0]).toEqual(['person', resultDoc, null, { custom: 'prop' }])
})

test('Creating a document for the second time should only call exists on doc store.', async () => {
  const testRequest = createTestRequestWithMockedDocStore({
    exists: async () => ({ found: true })
  })

  await expect(createDocument({
    ...testRequest,
    roleNames: ['admin'],
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docTypeName: 'person',
    constructorParams: {
      shortName: 'Donald',
      fullName: 'Donald Fresh',
      dateOfBirth: '2000-01-02',
      askedAboutMarketing: true
    },
    docStoreOptions: { custom: 'prop' }
  })).resolves.not.toThrow()

  expect(testRequest.mockedDocStore.exists.mock.calls.length).toEqual(1)
  expect(testRequest.mockedDocStore.exists.mock.calls[0]).toEqual(['person', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', { custom: 'prop' }])
})

test('Fail to create document if permissions insufficient.', async () => {
  const testRequest = createTestRequestWithMockedDocStore()

  await expect(createDocument({
    ...testRequest,
    roleNames: ['invalid'],
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docTypeName: 'person',
    constructorParams: {
      shortName: 'Donald',
      fullName: 'Donald Fresh',
      dateOfBirth: '2000-01-02',
      askedAboutMarketing: true
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})
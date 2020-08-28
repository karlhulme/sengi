/* eslint-env jest */
const { createJsonotronWithMockStore, defaultRequestProps } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('jsonotron-errors')

const constructorParams = {
  shortName: 'Donald',
  fullName: 'Donald Fresh',
  dateOfBirth: '2000-01-02',
  askedAboutMarketing: true
}

test('Creating a document should call exists and then upsert on doc store.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    exists: async () => ({ found: false }),
    upsert: async () => ({})
  })

  await expect(jsonotron.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: true })

  expect(jsonotron._test.docStore.exists.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.exists.mock.calls[0]).toEqual(['person', 'persons', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', {}, { custom: 'prop' }])

  const resultDoc = {
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docType: 'person',
    docHeader: {
      origin: { style: 'new', userIdentity: 'testUser', dateTime: '2020-01-01T14:22:03Z' },
      updated: { userIdentity: 'testUser', dateTime: '2020-01-01T14:22:03Z' },
      ops: [],
      calcs: {
        displayName: {
          value: 'Donald'
        },
        fullAddress: {
          value: ''
        }
      }
    },
    allowMarketing: 'yes',
    dateOfBirth: '2000-01-02',
    fullName: 'Donald Fresh',
    shortName: 'Donald',
    tenantId: 'companyA'
  }

  expect(jsonotron._test.docStore.upsert.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.upsert.mock.calls[0]).toEqual(['person', 'persons', resultDoc, {}, { custom: 'prop' }])
})

test('Creating a document should cause the onPreSave and onCreateDoc events to be invoked.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    exists: async () => ({ found: false }),
    upsert: async () => ({})
  }, {
    onPreSaveDoc: jest.fn(),
    onCreateDoc: jest.fn()
  })

  await expect(jsonotron.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: true })

  expect(jsonotron._test.config.onPreSaveDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Donald', fullName: 'Donald Fresh', tenantId: 'companyA' }),
    mergePatch: null
  })

  expect(jsonotron._test.config.onCreateDoc.mock.calls[0][0]).toEqual({
    roleNames: ['admin'],
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Donald', fullName: 'Donald Fresh', tenantId: 'companyA' })
  })
})

test('Creating a document for the second time should only call exists on doc store.', async () => {
  const jsonotron = createJsonotronWithMockStore({
    exists: async () => ({ found: true }),
    upsert: async () => ({})
  })

  await expect(jsonotron.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: false })

  expect(jsonotron._test.docStore.exists.mock.calls.length).toEqual(1)
  expect(jsonotron._test.docStore.exists.mock.calls[0]).toEqual(['person', 'persons', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', {}, { custom: 'prop' }])
})

test('Fail to create document if permissions insufficient.', async () => {
  const jsonotron = createJsonotronWithMockStore()

  await expect(jsonotron.createDocument({
    ...defaultRequestProps,
    roleNames: ['none'],
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

import { test, expect, jest } from '@jest/globals'
import { DocStoreUpsertResultCode, SengiInsufficientPermissionsError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const constructorParams = {
  shortName: 'Donald',
  fullName: 'Donald Fresh',
  dateOfBirth: '2000-01-02',
  askedAboutMarketing: 'yes'
}

test('Creating a document should call exists and then upsert on doc store.', async () => {
  const { docStore, sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: true })

  expect(docStore.exists).toHaveProperty('mock.calls.length', 1)
  expect(docStore.exists).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', 'd7fe060b-2d03-46e2-8cb5-ab18380790d1', { custom: 'prop' }, {}])

  const resultDoc = {
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    docType: 'person',
    docOps: [],
  
    // fields
    allowMarketing: 'yes',
    dateOfBirth: '2000-01-02',
    fullName: 'Donald Fresh',
    shortName: 'Donald',
    tenantId: 'companyA',

    // calc fields
    displayName: 'Donald',
    fullAddress: '',
  }

  expect(docStore.upsert).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty(['mock', 'calls', '0'], ['person', 'persons', resultDoc, { custom: 'prop' }, {}])
})

test('Creating a document should cause the onPreSaveDoc and onSavedDoc events to be invoked.', async () => {
  const { sengi, sengiCtorOverrides } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  }, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: jest.fn()
  })

  await expect(sengi.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: true })

  expect(sengiCtorOverrides.onPreSaveDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Donald', fullName: 'Donald Fresh', tenantId: 'companyA' }),
    isNew: true
  })

  expect(sengiCtorOverrides.onSavedDoc).toHaveProperty(['mock', 'calls', '0', '0'], {
    roleNames: ['admin'],
    docStoreOptions: { custom: 'prop' },
    reqProps: { foo: 'bar' },
    docType: expect.objectContaining({ title: 'Person', pluralTitle: 'Persons' }),
    doc: expect.objectContaining({ shortName: 'Donald', fullName: 'Donald Fresh', tenantId: 'companyA' }),
    isNew: true
  })
})

test('Creating a document that already exists should not lead to a call to upsert.', async () => {
  const { docStore, sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: true })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.createDocument({
    ...defaultRequestProps,
    docTypeName: 'person',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    constructorParams
  })).resolves.toEqual({ isNew: false })

  expect(docStore.exists).toHaveProperty('mock.calls.length', 1)
  expect(docStore.upsert).toHaveProperty('mock.calls.length', 0)
})

test('Fail to create document if permissions insufficient.', async () => {
  const { sengi } = createSengiWithMockStore()

  try {
    await sengi.createDocument({
      ...defaultRequestProps,
      roleNames: ['none'],
      docTypeName: 'person',
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      constructorParams
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInsufficientPermissionsError)
  }
})

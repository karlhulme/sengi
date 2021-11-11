import { test, expect, jest } from '@jest/globals'
import { DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode, SengiCallbackError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Error in onDeletedDoc callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore({
    fetch: jest.fn(async () => ({
      doc: {
        id: '06151119-065a-4691-a7c8-2d84ec746ba9',
        docType: 'car'
      }
    })),
    deleteById: async() => ({ code: DocStoreDeleteByIdResultCode.DELETED })
  }, {
    onDeletedDoc: () => { throw new Error('callback problem') }
  })

  try {
    await sengi.deleteDocument({
      ...defaultRequestProps,
      id: '06151119-065a-4691-a7c8-2d84ec746ba9'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('onDeletedDoc')
    expect((err as Error).message).toContain('callback problem')
  }
})

test('Error in onSavedDoc callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore({
    exists: async() => ({ found: false }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.CREATED })
  }, {
    onPreSaveDoc: jest.fn(),
    onSavedDoc: () => { throw new Error('callback problem') }
  })

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: {
        manufacturer: 'ford',
        model: 'ka',
        registration: 'HG12 3AB'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('onSavedDoc')
    expect((err as Error).message).toContain('callback problem')
  }
})

test('Error in onPreSaveDoc callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore({
    exists: async() => ({ found: false })
  }, {
    onPreSaveDoc: () => { throw new Error('callback problem' )}
  })

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: {
        manufacturer: 'ford',
        model: 'ka',
        registration: 'HG12 3AB'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('onPreSaveDoc')
    expect((err as Error).message).toContain('callback problem')
  }
})

test('Error in onPreQueryDocs callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore(undefined, {
    onPreQueryDocs: () => { throw new Error('callback problem' )}
  })

  try {
    await sengi.selectDocuments({
      ...defaultRequestProps,
      fieldNames: ['id']
    })
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('onPreQueryDocs')
    expect((err as Error).message).toContain('callback problem')
  }
})

test('Error in getMillisecondsSinceEpoch callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore(undefined, {
    getMillisecondsSinceEpoch: () => { throw new Error('callback problem' )}
  })

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: {
        manufacturer: 'ford',
        model: 'ka',
        registration: 'HG12 3AB'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('getMillisecondsSinceEpoch')
    expect((err as Error).message).toContain('callback problem')
  }
})

test('Error in getIdFromUser callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore(undefined, {
    getIdFromUser: () => { throw new Error('callback problem' )}
  })

  try {
    await sengi.newDocument({
      ...defaultRequestProps,
      id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
      doc: {
        manufacturer: 'ford',
        model: 'ka',
        registration: 'HG12 3AB'
      }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCallbackError)
    expect((err as SengiCallbackError).callbackName).toEqual('getIdFromUser')
    expect((err as Error).message).toContain('callback problem')
  }
})

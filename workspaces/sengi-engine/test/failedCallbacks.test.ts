import { test, expect, jest } from '@jest/globals'
import { DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode, SengiCallbackError } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

test('Error in onDeletedDoc callback should be wrapped.', async () => {
  const { sengi } = createSengiWithMockStore({
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
    expect(err.callbackName).toEqual('onDeletedDoc')
    expect(err.message).toContain('callback problem')
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
    expect(err.callbackName).toEqual('onSavedDoc')
    expect(err.message).toContain('callback problem')
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
    expect(err.callbackName).toEqual('onPreSaveDoc')
    expect(err.message).toContain('callback problem')
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
    expect(err.callbackName).toEqual('onPreQueryDocs')
    expect(err.message).toContain('callback problem')
  }
})

import { expect, test } from '@jest/globals'
import {
  DocStore,
  DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode,
  MissingDocStoreFunctionError, UnexpectedDocStoreError
} from 'sengi-interfaces'
import { asError } from '../utils'
import { SafeDocStore } from './SafeDocStore'

function createTestDocStore (): DocStore<unknown, unknown, unknown, unknown> {
  return {
    deleteById: async () => ({ code: DocStoreDeleteByIdResultCode.DELETED }),
    exists: async () => ({ found: true }),
    fetch: async () => ({ doc: { id: '1234', docType: 'test', docVersion: 'aaaa', docOpIds: [] } }),
    query: async () => ({ data: null }),
    selectAll: async () => ({ docs: [] }),
    selectByFilter: async () => ({ docs: [] }),
    selectByIds: async () => ({ docs: [] }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.CREATED })
  }
}

type DocStoreAmendFunc = (docStore: Record<string, unknown>) => void

function createBespokeDocStore (amendFunc: DocStoreAmendFunc): DocStore<unknown, unknown, unknown, unknown> {
  const docStore = createTestDocStore()
  amendFunc(docStore as unknown as Record<string, unknown>)
  return docStore
}

test('A safe doc store passes through values from the underlying doc store.', async () => {
  const docStore = createTestDocStore()
  const safeDocStore = new SafeDocStore(docStore)

  await expect(safeDocStore.deleteById('', '', '', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.DELETED })
  await expect(safeDocStore.exists('', '', '', {}, {})).resolves.toEqual({ found: true })
  await expect(safeDocStore.fetch('', '', '', {}, {})).resolves.toEqual({ doc: { id: '1234', docType: 'test', docVersion: 'aaaa', docOpIds: [] } })
  await expect(safeDocStore.query('', '', '', {}, {})).resolves.toEqual({ data: null })
  await expect(safeDocStore.selectAll('', '', [], {}, {})).resolves.toEqual({ docs: [] })
  await expect(safeDocStore.selectByFilter('', '', [], {}, {}, {})).resolves.toEqual({ docs: [] })
  await expect(safeDocStore.selectByIds('', '', [], [], {}, {})).resolves.toEqual({ docs: [] })
  await expect(safeDocStore.upsert('', '', {}, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.CREATED })
})

test('A safe doc store detects missing methods.', async () => {
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.deleteById }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.exists }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.fetch }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.query }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.selectAll }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.selectByFilter }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.selectByIds }))).toThrow(asError(MissingDocStoreFunctionError))
  expect(() => new SafeDocStore(createBespokeDocStore(ds => { delete ds.upsert }))).toThrow(asError(MissingDocStoreFunctionError))
})

test('A safe doc store wraps underlying errors.', async () => {
  const docStore = createBespokeDocStore(ds => {
    ds.deleteById = async () => { throw new Error('fail') }
    ds.exists = async () => { throw new Error('fail') }
    ds.fetch = async () => { throw new Error('fail') }
    ds.query = async () => { throw new Error('fail') }
    ds.selectAll = async () => { throw new Error('fail') }
    ds.selectByFilter = async () => { throw new Error('fail') }
    ds.selectByIds = async () => { throw new Error('fail') }
    ds.upsert = async () => { throw new Error('fail') }
  })

  const safeDocStore = new SafeDocStore(docStore)

  await expect(() => safeDocStore.deleteById('', '', '', {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.exists('', '', '', {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.fetch('', '', '', {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.query('', '', '', {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.selectAll('', '', [], {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.selectByFilter('', '', [], {}, {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.selectByIds('', '', [], [], {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
  await expect(() => safeDocStore.upsert('', '', {}, {}, {})).rejects.toThrow(asError(UnexpectedDocStoreError))
})

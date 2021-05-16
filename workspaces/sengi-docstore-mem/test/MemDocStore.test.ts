import { expect, test } from '@jest/globals'
import { DocRecord, DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode } from 'sengi-interfaces'
import { MemDocStore } from '../src'

function createDocs (): DocRecord[] {
  return [
    { id: '001', docType: 'test', fruit: 'apple', docVersion: 'aaa1', docOpIds: [] },
    { id: '002', docType: 'test', fruit: 'banana', docVersion: 'aaa2', docOpIds: [] },
    { id: '003', docType: 'test', fruit: 'orange', docVersion: 'aaa3', docOpIds: [] },
    { id: '101', docType: 'test2', vehicle: 'car', docVersion: 'a101', docOpIds: [] },
    { id: '102', docType: 'test2', vehicle: 'cargoBoat', docVersion: 'a102', docOpIds: [] },
    { id: '103', docType: 'test2', vehicle: 'plane', docVersion: 'a103', docOpIds: [] }
  ]
}

function generateDocVersionFunc () {
  return 'xxxx'
}

test('A document can be deleted.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.deleteById('test', 'tests', '003', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.DELETED })
  expect(docs.length).toEqual(5)
  expect(docs.map(d => d.id)).toEqual(['001', '002', '101', '102', '103'])
})

test('A non-existent document can be deleted without error.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.deleteById('test', 'tests', '200', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.NOT_FOUND })
  expect(docs.length).toEqual(6)
  expect(docs.map(d => d.id)).toEqual(['001', '002', '003', '101', '102', '103'])
})

test('A document can be found to exist.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.exists('test', 'tests', '003', {}, {})).resolves.toEqual({ found: true })
})

test('A non-existent document is not found.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.exists('test', 'tests', '005', {}, {})).resolves.toEqual({ found: false })
})

test('A document can be fetched.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.fetch('test', 'tests', '003', {}, {})).resolves.toEqual({ doc: { id: '003', docType: 'test', fruit: 'orange', docVersion: 'aaa3', docOpIds: [] } })
})

test('A non-existent document cannot be fetched.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.fetch('test', 'tests', '005', {}, {})).resolves.toEqual({ doc: null })
})

test('A count query can be executed.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.query('test', 'tests', { count: true }, {}, {})).resolves.toEqual({ queryResult: { count: 3 } })
})

test('An unknown query can be executed.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.query('test', 'tests', {}, {}, {})).resolves.toEqual({ queryResult: {} })
})

test('All documents of a type can be selected.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectAll('test', 'tests', ['id'], {}, {})).resolves.toEqual({ docs: [{ id: '001' }, { id: '002' }, { id: '003' }] })
  await expect(docStore.selectAll('test2', 'test2s', ['vehicle'], {}, {})).resolves.toEqual({ docs: [{ vehicle: 'car' }, { vehicle: 'cargoBoat' }, { vehicle: 'plane' }] })
})

test('All documents of a type can be retrieved in pages.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectAll('test', 'tests', ['id'], {}, { limit: 2 })).resolves.toEqual({ docs: [{ id: '001' }, { id: '002' }] })
  await expect(docStore.selectAll('test', 'tests', ['id'], {}, { limit: 2, offset: 2 })).resolves.toEqual({ docs: [{ id: '003' }] })
})

test('All documents of a recognised type can selected.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectAll('test3', 'tests', ['fieldA', 'fieldB'], {}, {})).resolves.toEqual({ docs: [] })
})

test('Select documents using a filter.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectByFilter('test2', 'test2s', ['id', 'vehicle'], d => (d.vehicle as string).startsWith('c'), {}, {}))
    .resolves.toEqual({ docs: [{ id: '101', vehicle: 'car' }, { id: '102', vehicle: 'cargoBoat' }] })
})

test('Select documents using a filter and paging.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectByFilter('test2', 'test2s', ['id', 'vehicle'], d => Boolean(d.vehicle), {}, { limit: 1 }))
    .resolves.toEqual({ docs: [{ id: '101', vehicle: 'car' }] })
  await expect(docStore.selectByFilter('test2', 'test2s', ['id', 'vehicle'], d => Boolean(d.vehicle), {}, { limit: 1, offset: 1 }))
    .resolves.toEqual({ docs: [{ id: '102', vehicle: 'cargoBoat' }] })
})

test('Select documents using ids.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectByIds('test', 'tests', ['id', 'fruit'], ['002', '003'], {}, {}))
    .resolves.toEqual({ docs: [{ id: '002', fruit: 'banana' }, { id: '003', fruit: 'orange' }] })
})

test('Select documents using ids that appear multiple times.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.selectByIds('test', 'tests', ['id', 'fruit'], ['002', '003', '002'], {}, {}))
    .resolves.toEqual({ docs: [{ id: '002', fruit: 'banana' }, { id: '003', fruit: 'orange' }] })
})

test('Insert a new document and rely on doc store to generate doc version.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.upsert('test', 'tests', { id: '004', docType: 'test', fruit: 'kiwi', docVersion: '000', docOpIds: [] }, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.CREATED })
  expect(docs.length).toEqual(7)
  expect(docs.map(d => d.id)).toEqual(['001', '002', '003', '101', '102', '103', '004'])
  expect(docs[6]).toEqual({ id: '004', docType: 'test', fruit: 'kiwi', docVersion: 'xxxx', docOpIds: [] })
})

test('Update an existing document.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.upsert('test2', 'test2s', { id: '102', docType: 'test2', vehicle: 'tank', docVersion: '000', docOpIds: [] }, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })
  expect(docs.length).toEqual(6)
  expect(docs.map(d => d.id)).toEqual(['001', '002', '003', '101', '102', '103'])
  expect(docs[4]).toEqual({ id: '102', docType: 'test2', vehicle: 'tank', docVersion: 'xxxx', docOpIds: [] })
})

test('Update an existing document with a required version.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.upsert('test2', 'test2s', { id: '102', docType: 'test2', vehicle: 'tank', docVersion: '000', docOpIds: [] }, {}, { reqVersion: 'a102' })).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })
  expect(docs.length).toEqual(6)
  expect(docs.map(d => d.id)).toEqual(['001', '002', '003', '101', '102', '103'])
  expect(docs[4]).toEqual({ id: '102', docType: 'test2', vehicle: 'tank', docVersion: 'xxxx', docOpIds: [] })
})

test('Fail to update an existing document if the required version is unavailable.', async () => {
  const docs = createDocs()
  const docStore = new MemDocStore({ docs, generateDocVersionFunc })
  await expect(docStore.upsert('test2', 'test2s', { id: '102', docType: 'test2', vehicle: 'tank', docVersion: '000', docOpIds: [] }, {}, { reqVersion: 'a999' })).resolves.toEqual({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })
  expect(docs.length).toEqual(6)
  expect(docs[4]).toEqual({ id: '102', docType: 'test2', vehicle: 'cargoBoat', docVersion: 'a102', docOpIds: [] })
})

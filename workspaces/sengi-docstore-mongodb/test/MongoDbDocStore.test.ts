import { expect, test } from '@jest/globals'
import { Db, Collection, MongoClient, MongoClientOptions } from 'mongodb'
import { DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode } from 'sengi-interfaces'
import { MongoDbDoc, MongoDbDocStore } from '../src'

function getMongoUrl (): string {
  return 'mongodb://localhost:27017'
}

function createMongoClientOptions (): MongoClientOptions {
  return {
    auth: { user: 'sengi', password: 'sengi' },
    ignoreUndefined: true,
    useUnifiedTopology: true
  }
}

async function createMongoDbDocStore (): Promise<MongoDbDocStore> {
  const docStore = new MongoDbDocStore({
    mongoUrl: getMongoUrl(),
    mongoOptions: createMongoClientOptions(),
    generateDocVersionFunc: () => 'xxxx',
    getDatabaseNameFunc: () => 'sengi-test',
    getCollectionNameFunc: () => 'trees'
  })

  await docStore.connect()

  return docStore
}

interface MongoTestConnection {
  mongoClient: MongoClient
  mongoDatabase: Db
  mongoCollection: Collection
}

async function initDb (): Promise<MongoTestConnection> {
  const MAX_ITEMS_TO_DELETE = 10

  const mongoClient = new MongoClient(getMongoUrl(), createMongoClientOptions())
  await mongoClient.connect()

  const mongoDatabase = mongoClient.db('sengi-test')
  const mongoCollection = mongoDatabase.collection('trees')

  const documentCount = await mongoCollection.countDocuments()

  if (documentCount > MAX_ITEMS_TO_DELETE) {
    throw new Error(`Collection has ${documentCount} items. ` +
      `Max that can be cleared is '${MAX_ITEMS_TO_DELETE}'.`)
  }

  // delete the existing docs from the collection
  await mongoCollection.deleteMany({})

  // define docs for the database
  const docs: MongoDbDoc[] = [
    { _id: '01', docType: 'tree', name: 'ash', heightInCms: 210, docVersion: 'aaa1', docOpIds: [] },
    { _id: '02', docType: 'tree', name: 'beech', heightInCms: 225, docVersion: 'aaa2', docOpIds: [] },
    { _id: '03', docType: 'tree', name: 'pine', heightInCms: 180, docVersion: 'aaa3', docOpIds: [] }
  ]

  // add the new docs into the collection
  await mongoCollection.insertMany(docs)

  return { mongoClient, mongoDatabase, mongoCollection }
}

test('A document can be deleted.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.deleteById('tree', 'trees', '03', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.DELETED })
  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(2)

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A non-existent document can be deleted without error.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.deleteById('tree', 'trees', '200', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.NOT_FOUND })
  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(3)

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A document can be found to exist.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.exists('tree', 'trees', '02', {}, {})).resolves.toEqual({ found: true })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A non-existent document is not found.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.exists('tree', 'trees', '202', {}, {})).resolves.toEqual({ found: false })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A document can be fetched.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.fetch('tree', 'trees', '02', {}, {})).resolves.toEqual({ doc: { id: '02', docType: 'tree', name: 'beech', heightInCms: 225, docVersion: 'aaa2', docOpIds: [] } })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A non-existent document cannot be fetched.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.fetch('tree', 'trees', '202', {}, {})).resolves.toEqual({ doc: null })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('A query can be executed.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.query('tree', 'trees', { estimatedCount: true }, {}, {})).resolves.toEqual({ queryResult: { estimatedCount: 3 } })
  await expect(testConn.mongoCollection.estimatedDocumentCount()).resolves.toEqual(3)

  await docStore.close()
  await testConn.mongoClient.close()
})

test('An empty command can be executed.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.query('tree', 'trees', {}, {}, {})).resolves.toEqual({ queryResult: {} })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('All documents of a type can be selected.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectAll('tree', 'trees', ['id'], {}, {})).resolves.toEqual({ docs: [{ id: '01' }, { id: '02' }, { id: '03' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('All documents of a type can be retrieved in pages.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectAll('tree', 'trees', ['id'], {}, { limit: 2 })).resolves.toEqual({ docs: [{ id: '01' }, { id: '02' }] })
  await expect(docStore.selectAll('tree', 'trees', ['id'], {}, { limit: 2, offset: 2 })).resolves.toEqual({ docs: [{ id: '03' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Select documents using a filter.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectByFilter('tree', 'trees', ['id'], { heightInCms: { $gt: 200 } }, {}, {})).resolves.toEqual({ docs: [{ id: '01' }, { id: '02' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Select documents using a filter and paging.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectByFilter('tree', 'trees', ['id'], { heightInCms: { $gt: 200 } }, {}, { limit: 1, offset: 1 })).resolves.toEqual({ docs: [{ id: '02' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Select documents using ids.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectByIds('tree', 'trees', ['id', 'name'], ['02', '03'] , {}, {})).resolves.toEqual({ docs: [{ id: '02', name: 'beech' }, { id: '03', name: 'pine' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Select documents using ids that appear multiple times.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  await expect(docStore.selectByIds('tree', 'trees', ['name'], ['02', '03', '03', '02'] , {}, {})).resolves.toEqual({ docs: [{ name: 'beech' }, { name: 'pine' }] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Insert a new document and rely on doc store to generate doc version.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  const doc = { id: '04', docType: 'tree', name: 'oak', heightInCms: 150, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.CREATED })

  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(4)
  const newDoc = await testConn.mongoCollection.findOne({ _id: '04' })
  expect(newDoc).toEqual({ _id: '04', id: '04', docType: 'tree', name: 'oak', heightInCms: 150, docVersion: 'xxxx', docOpIds: [] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Update an existing document.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  const doc = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })

  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(3)
  const newDoc = await testConn.mongoCollection.findOne({ _id: '03' })
  expect(newDoc).toEqual({ _id: '03', id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'xxxx', docOpIds: [] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Update an existing document with a required version.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  const doc = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, { reqVersion: 'aaa3' })).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })

  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(3)
  const newDoc = await testConn.mongoCollection.findOne({ _id: '03' })
  expect(newDoc).toEqual({ _id: '03', id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'xxxx', docOpIds: [] })

  await docStore.close()
  await testConn.mongoClient.close()
})

test('Fail to update an existing document if the required version is unavailable.', async () => {
  const testConn = await initDb()
  const docStore = await createMongoDbDocStore()

  const doc = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, { reqVersion: 'bbbb' })).resolves.toEqual({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  await expect(testConn.mongoCollection.countDocuments()).resolves.toEqual(3)

  await docStore.close()
  await testConn.mongoClient.close()
})

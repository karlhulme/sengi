import { expect, test } from '@jest/globals'
import AWS from 'aws-sdk'
import { DocRecord, DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode } from 'sengi-interfaces'
import { DynamoDbDocStore } from '../src'

const DYNAMO_URL = 'http://localhost:8000'
const TEST_DYNAMODB_REGION = 'us-east-1'
const API_VERSION = '2012-08-10'
const TABLE_NAME = 'sengi.testing.trees'

function createDynamoDbDocStore (): DynamoDbDocStore {
  return new DynamoDbDocStore({
    dynamoUrl: DYNAMO_URL,
    region: TEST_DYNAMODB_REGION,
    generateDocVersionFunc: () => 'xxxx',
    getTableNameFunc: () => TABLE_NAME
  })
}

async function initDb (): Promise<void> {
  const MAX_ITEMS_TO_DELETE = 10

  AWS.config.update({
    region: TEST_DYNAMODB_REGION,
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx'
  })

  const dynamoClient = new AWS.DynamoDB.DocumentClient({
    endpoint: DYNAMO_URL,
    region: TEST_DYNAMODB_REGION,
    apiVersion: API_VERSION
  })

  const allContents = await dynamoClient.scan({ TableName: TABLE_NAME }).promise()

  if ((allContents.Count || 0) > MAX_ITEMS_TO_DELETE) {
    throw new Error(`Table '${TABLE_NAME}' has ${allContents.Count} items. ` +
      `Max that can be cleared is '${MAX_ITEMS_TO_DELETE}'.`)
  }

  // delete the existing docs from the table
  for (const item of (allContents.Items || [])) {
    const key = { id: item.id }
    await dynamoClient.delete({ TableName: TABLE_NAME, Key: key }).promise()
  }

  const docs: DocRecord[] = [
    { id: '01', docType: 'tree', name: 'ash', heightInCms: 210, docVersion: 'aaa1', docOpIds: [] },
    { id: '02', docType: 'tree', name: 'beech', heightInCms: 225, docVersion: 'aaa2', docOpIds: [] },
    { id: '03', docType: 'tree', name: 'pine', heightInCms: 180, docVersion: 'aaa3', docOpIds: [] }
  ]

  // add the test docs into the table
  for (const doc of docs) {
    await dynamoClient.put({ TableName: TABLE_NAME, Item: doc }).promise()
  }
}

async function readTable (): Promise<DocRecord[]> {
  const dynamoClient = new AWS.DynamoDB.DocumentClient({
    endpoint: DYNAMO_URL,
    region: TEST_DYNAMODB_REGION,
    apiVersion: API_VERSION
  })

  const allContents = await dynamoClient.scan({ TableName: TABLE_NAME }).promise()

  return (allContents.Items || []).sort((a, b) => a.id.localeCompare(b.id))
}

test('A document can be deleted.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.deleteById('tree', 'trees', '03', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.DELETED })

  await expect(readTable()).resolves.toHaveLength(2)
})

test('A non-existent document can be deleted without error.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.deleteById('tree', 'trees', '200', {}, {})).resolves.toEqual({ code: DocStoreDeleteByIdResultCode.NOT_FOUND })
  
  await expect(readTable()).resolves.toHaveLength(3)
})

test('A document can be found to exist.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.exists('tree', 'trees', '02', {}, {})).resolves.toEqual({ found: true })
})

test('A non-existent document is not found.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.exists('tree', 'trees', '202', {}, {})).resolves.toEqual({ found: false })
})

test('A document can be fetched.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.fetch('tree', 'trees', '02', {}, {})).resolves.toEqual({ doc: { id: '02', docType: 'tree', name: 'beech', heightInCms: 225, docVersion: 'aaa2', docOpIds: [] } })
})

test('A non-existent document cannot be fetched.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.fetch('tree', 'trees', '202', {}, {})).resolves.toEqual({ doc: null })
})

test('A count query can be executed.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.query('tree', 'trees', { estimatedCount: true }, {}, {})).resolves.toEqual({ queryResult: { estimatedCount: 3 } })
})

test('A blank query can be executed.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  await expect(docStore.query('tree', 'trees', {}, {}, {})).resolves.toEqual({ queryResult: {} })
})

test('All documents of a type can be selected.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const result = await docStore.selectAll('tree', 'trees', ['id'], {}, {})
  const sortedDocs = result.docs.sort((a, b) => (a.id as string).localeCompare(b.id as string))
  expect(sortedDocs).toEqual([{ id: '01' }, { id: '02' }, { id: '03' }])
})

test('All documents of a type can be retrieved in pages.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const result = await docStore.selectAll('tree', 'trees', ['id'], {}, { limit: 2 })
  expect(result.docs).toHaveLength(2)

  // dynamodb doc store does not support the offset property.
  const result2 = await docStore.selectAll('tree', 'trees', ['id'], {}, { limit: 2, offset: 10 })
  expect(result2.docs).toHaveLength(2)
})

test('Select documents using a filter.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const filterExpression = {
    indexName: 'treeHeightIndex',
    condition: 'docType = :docType and heightInCms > :heightParam',
    conditionParams: {
      ':docType': 'tree',
      ':heightParam': 200
    }
  }

  const result = await docStore.selectByFilter('tree', 'trees', ['id'], filterExpression, {}, {})
  expect(result.docs).toHaveLength(2)
  expect(result.docs.findIndex(d => d.id === '01')).toBeGreaterThanOrEqual(0)
  expect(result.docs.findIndex(d => d.id === '02')).toBeGreaterThanOrEqual(0)
})

test('Select documents using a filter with renames.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const filterExpression = {
    indexName: 'treeHeightIndex',
    condition: '#docTypeVar = :docType and heightInCms > :heightParam',
    conditionParams: {
      ':docType': 'tree',
      ':heightParam': 200
    },
    conditionParamNames: {
      '#docTypeVar': 'docType'
    }
  }

  const result = await docStore.selectByFilter('tree', 'trees', ['id'], filterExpression, {}, {})
  expect(result.docs).toHaveLength(2)
  expect(result.docs.findIndex(d => d.id === '01')).toBeGreaterThanOrEqual(0)
  expect(result.docs.findIndex(d => d.id === '02')).toBeGreaterThanOrEqual(0)
})

test('Select documents using a filter and paging.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const filterExpression = {
    indexName: 'treeHeightIndex',
    condition: 'docType = :docType and heightInCms > :heightParam',
    conditionParams: {
      ':docType': 'tree',
      ':heightParam': 200
    }
  }

  const result = await docStore.selectByFilter('tree', 'trees', ['id'], filterExpression, {}, { limit: 1, offset: 10 })
  expect(result.docs).toHaveLength(1)
  expect(result.docs.findIndex(d => ['01', '02'].includes(d.id as string))).toBeGreaterThanOrEqual(0)
})

test('Select documents using ids.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const result = await docStore.selectByIds('tree', 'trees', ['id', 'name'], ['02', '03'] , {}, {})
  expect(result.docs).toHaveLength(2)
  expect(result.docs.find(d => d.id === '02')).toEqual({ id: '02', name: 'beech' })
  expect(result.docs.find(d => d.id === '03')).toEqual({ id: '03', name: 'pine' })
})

test('Select documents using ids and an empty field list.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const result = await docStore.selectByIds('tree', 'trees', [], ['02', '03'] , {}, {})
  expect(result.docs).toHaveLength(2)
})

test('Select documents using ids that appear multiple times.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const result = await docStore.selectByIds('tree', 'trees', ['name'], ['02', '03', '03', '02'] , {}, {})
  expect(result.docs).toHaveLength(2)
  expect(result.docs.find(d => d.name === 'beech')).toEqual({ name: 'beech' })
  expect(result.docs.find(d => d.name === 'pine')).toEqual({ name: 'pine' })
})

test('Insert a new document and rely on doc store to generate doc version.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const doc: DocRecord = { id: '04', docType: 'tree', name: 'oak', heightInCms: 150, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.CREATED })

  const contents = await readTable()
  expect(contents).toHaveLength(4)
  expect(contents.find(d => d.id === '04')).toEqual({ id: '04', docType: 'tree', name: 'oak', heightInCms: 150, docVersion: 'xxxx', docOpIds: [] })
})

test('Update an existing document.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const doc: DocRecord = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, {})).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })

  const contents = await readTable()
  expect(contents).toHaveLength(3)
  expect(contents.find(d => d.id === '03')).toEqual({ id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'xxxx', docOpIds: [] })
})

test('Update an existing document with a required version.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const doc: DocRecord = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, { reqVersion: 'aaa3' })).resolves.toEqual({ code: DocStoreUpsertResultCode.REPLACED })

  const contents = await readTable()
  expect(contents).toHaveLength(3)
  expect(contents.find(d => d.id === '03')).toEqual({ id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'xxxx', docOpIds: [] })
})

test('Fail to update an existing document if the required version is unavailable.', async () => {
  await initDb()
  const docStore = createDynamoDbDocStore()

  const doc: DocRecord = { id: '03', docType: 'tree', name: 'palm', heightInCms: 123, docVersion: 'not_used', docOpIds: [] }
  await expect(docStore.upsert('tree', 'trees', doc, {}, { reqVersion: 'bbbb' })).resolves.toEqual({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })

  const contents = await readTable()
  expect(contents).toHaveLength(3)
  expect(contents.find(d => d.id === '03')).toEqual({ id: '03', docType: 'tree', name: 'pine', heightInCms: 180, docVersion: 'aaa3', docOpIds: [] })
})

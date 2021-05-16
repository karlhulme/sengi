import { expect, test } from '@jest/globals'
import {
  DocStore,
  DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode,
  MissingDocStoreFunctionError, UnexpectedDocStoreError
} from 'sengi-interfaces'
import { SafeDocStore } from './SafeDocStore'

function createDocStoreMock (): DocStore<unknown, unknown, unknown, unknown> {
  return {
    deleteById: async () => ({ code: DocStoreDeleteByIdResultCode.DELETED }),
    exists: async () => ({ found: true }),
    fetch: async () => ({ doc: { id: '1234', docType: 'test', docVersion: 'aaaa', docOpIds: [] } }),
    query: async () => ({ queryResult: null }),
    selectAll: async () => ({ docs: [] }),
    selectByFilter: async () => ({ docs: [] }),
    selectByIds: async () => ({ docs: [] }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.CREATED })
  }
}

function testMissingFunction (functionName: string): void {
  try {
    const docStore = createDocStoreMock()
    delete docStore[functionName]
    new SafeDocStore(docStore)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(MissingDocStoreFunctionError)
    expect(err.functionName).toEqual(functionName)
  }
}

async function testErroringFunction (functionName: string): Promise<void> {
  try {
    const docStore = createDocStoreMock()
    docStore[functionName] = () => { throw new Error('doc-store-error' )}
    const safeDocStore = new SafeDocStore(docStore)
    const callableDocStore = safeDocStore as unknown as Record<string, () => Promise<void>>
    await callableDocStore[functionName]()
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(UnexpectedDocStoreError)
    expect(err.functionName).toEqual(functionName)
    expect(err.innerErr.message).toEqual('doc-store-error')
  }
}

async function testReturningFunction (functionName: string): Promise<void> {
  const docStore = createDocStoreMock()
  docStore[functionName] = () => 'value'
  const safeDocStore = new SafeDocStore(docStore)
  const callableDocStore = safeDocStore as unknown as Record<string, () => Promise<void>>
  const result = await callableDocStore[functionName]()
  expect(result).toEqual('value')
}

test('Creating a safe doc store using a doc store with missing functions will raise an error.', async () => {
  testMissingFunction('deleteById')
  testMissingFunction('exists')
  testMissingFunction('fetch')
  testMissingFunction('query')
  testMissingFunction('selectAll')
  testMissingFunction('selectByFilter')
  testMissingFunction('selectByIds')
  testMissingFunction('upsert')
})

test('An error in an underlying doc store will be wrapped by the safe doc store.', async () => {
  await testErroringFunction('deleteById')
  await testErroringFunction('exists')
  await testErroringFunction('fetch')
  await testErroringFunction('query')
  await testErroringFunction('selectAll')
  await testErroringFunction('selectByFilter')
  await testErroringFunction('selectByIds')
  await testErroringFunction('upsert')
})

test('Results from the underlying doc store are passed through the safe doc store.', async () => {
  await testReturningFunction('deleteById')
  await testReturningFunction('exists')
  await testReturningFunction('fetch')
  await testReturningFunction('query')
  await testReturningFunction('selectAll')
  await testReturningFunction('selectByFilter')
  await testReturningFunction('selectByIds')
  await testReturningFunction('upsert')
})

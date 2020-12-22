import { expect, test } from '@jest/globals'
import { DocStore, MissingDocStoreFunctionError, UnexpectedDocStoreError } from 'sengi-interfaces'
import { SafeDocStore } from './SafeDocStore'

function createDocStoreMock (): Record<string, unknown> {
  return {
    deleteById: () => 'deleteById',
    exists: () => 'exists',
    fetch: () => 'fetch',
    queryAll: () => 'queryAll',
    queryByFilter: () => 'queryByFilter',
    queryByIds: () => 'queryByIds',
    upsert: () => 'upsert'
  }
}

function testMissingFunction (functionName: string): void {
  try {
    const docStore = createDocStoreMock()
    delete docStore[functionName]
    new SafeDocStore(docStore as unknown as DocStore)
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
    const safeDocStore = new SafeDocStore(docStore as unknown as DocStore)
    const callableDocStore = safeDocStore as unknown as Record<string, () => Promise<void>>
    await callableDocStore[functionName]()
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(UnexpectedDocStoreError)
    expect(err.functionName).toEqual(functionName)
    expect(err.innerErr.message).toEqual('doc-store-error')
  }
}

test('Creating a SafeDocStore using a doc store with missing functions will raise an error.', async () => {
  testMissingFunction('deleteById')
  testMissingFunction('exists')
  testMissingFunction('fetch')
  testMissingFunction('queryAll')
  testMissingFunction('queryByFilter')
  testMissingFunction('queryByIds')
  testMissingFunction('upsert')
})

test('An error in an underlying doc store will be wrapped by the safe doc store.', async () => {
  await testErroringFunction('deleteById')
  await testErroringFunction('exists')
  await testErroringFunction('fetch')
  await testErroringFunction('queryAll')
  await testErroringFunction('queryByFilter')
  await testErroringFunction('queryByIds')
  await testErroringFunction('upsert')
})

test('Results from the underlying doc store are passed through the SafeDocStore.', async () => {
  const docStoreMock = createDocStoreMock()

  const safeDocStore = new SafeDocStore(docStoreMock as unknown as DocStore)
  const callableSafeDocStore = safeDocStore as unknown as Record<string, () => Promise<string>>
  
  await expect(callableSafeDocStore.deleteById()).resolves.toEqual('deleteById')
  await expect(callableSafeDocStore.exists()).resolves.toEqual('exists')
  await expect(callableSafeDocStore.fetch()).resolves.toEqual('fetch')
  await expect(callableSafeDocStore.queryAll()).resolves.toEqual('queryAll')
  await expect(callableSafeDocStore.queryByFilter()).resolves.toEqual('queryByFilter')
  await expect(callableSafeDocStore.queryByIds()).resolves.toEqual('queryByIds')
  await expect(callableSafeDocStore.upsert()).resolves.toEqual('upsert')
})

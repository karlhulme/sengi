/* eslint-env jest */
const wrapDocStore = require('./wrapDocStore')
const {
  JsonotronDocStoreInvalidResponseError,
  JsonotronDocStoreFailureError,
  JsonotronDocStoreMissingFunctionError,
  JsonotronDocStoreUnrecognisedErrorCodeError,
  JsonotronInternalError,
  JsonotronRequiredVersionNotAvailableError
} = require('../errors')

const docStoreWithoutFunctions = {
  deleteById: null,
  exists: true,
  fetch: 123,
  queryAll: 'hello',
  queryByFilter: {},
  queryByIds: [],
  upsert: undefined
}

const docStoreWithErroringFunctions = {
  deleteById: () => { throw new Error('A') },
  exists: () => { throw new Error('A2') },
  fetch: () => { throw new Error('B') },
  queryAll: () => { throw new Error('C') },
  queryByFilter: () => { throw new Error('D') },
  queryByIds: () => { throw new Error('E') },
  upsert: () => { throw new Error('F') }
}

const docStoreWithValidFunctions = {
  deleteById: () => ({}),
  exists: () => ({ found: true }),
  fetch: () => ({ doc: { id: '123', docType: 'test', docVersion: 'aaaa', docOps: [] } }),
  queryAll: () => ({ docs: [] }),
  queryByFilter: () => ({ docs: [] }),
  queryByIds: () => ({ docs: [] }),
  upsert: () => ({})
}

const docStoreWithFunctionsWithInvalidReturns = {
  deleteById: () => null,
  exists: () => ({ errorCode: 'UNKNOWN_CODE' }),
  queryByIds: () => ({}),
  upsert: () => ({ errorCode: 'DOC_STORE_REQ_VERSION_NOT_AVAILABLE' })
}

const docStoreWithMalformedExists = { exists: () => ({ missingFoundProp: true }) }

const docStoreWithMalformedFetch = { fetch: () => ({ doc: 'not an object' }) }
const docStoreWithMalformedDocId = { fetch: () => ({ doc: { docType: 'test', docVersion: 'aaaa', docOps: [] } }) }
const docStoreWithWrongDocId = { fetch: () => ({ doc: { id: '456', docType: 'test', docVersion: 'aaaa', docOps: [] } }) }
const docStoreWithMalformedDocType = { fetch: () => ({ doc: { id: '123', docType: 'somethingWrong', docVersion: 'aaaa', docOps: [] } }) }
const docStoreWithMalformedDocVersion = { fetch: () => ({ doc: { id: '123', docType: 'test', docVersion: 111, docOps: [] } }) }
const docStoreWithMalformedDocOps = { fetch: () => ({ doc: { id: '123', docType: 'test', docVersion: 'aaaa', docOps: 'notAnArray' } }) }

const docStoreWithMalformedQueryAll = { queryAll: () => ({ docs: 'not an array' }) }
const docStoreWithMalformedDocsId = { queryAll: () => ({ docs: [{ id: 123, docType: 'test', docVersion: 'aaaa', docOps: [] }] }) }
const docStoreWithMalformedDocsType = { queryAll: () => ({ docs: [{ id: '123', docType: 'somethingWrong', docVersion: 'aaaa', docOps: [] }] }) }
const docStoreWithMalformedDocsVersion = { queryAll: () => ({ docs: [{ id: '123', docType: 'test', docVersion: 111, docOps: [] }] }) }
const docStoreWithMalformedDocsOps = { queryAll: () => ({ docs: [{ id: '123', docType: 'test', docVersion: 'aaaa', docOps: 'notAnArray' }] }) }

test('A doc store without functions will throw missing function errors.', async () => {
  const safeDocStore = wrapDocStore(docStoreWithoutFunctions)
  await expect(safeDocStore.deleteById('test', '123')).rejects.toThrow(JsonotronDocStoreMissingFunctionError)
  await expect(safeDocStore.deleteById('test', '123')).rejects.toThrow(/document store does not provide an implementation of 'deleteById'/)
  await expect(safeDocStore.exists('test', '123')).rejects.toThrow(/document store does not provide an implementation of 'exists'/)
  await expect(safeDocStore.fetch('test', '123')).rejects.toThrow(/document store does not provide an implementation of 'fetch'/)
  await expect(safeDocStore.queryAll('test', ['id'])).rejects.toThrow(/document store does not provide an implementation of 'queryAll'/)
  await expect(safeDocStore.queryByFilter('test', ['id'], 'A and B')).rejects.toThrow(/document store does not provide an implementation of 'queryByFilter'/)
  await expect(safeDocStore.queryByIds('test', ['id'], ['123', '234'])).rejects.toThrow(/document store does not provide an implementation of 'queryByIds'/)
  await expect(safeDocStore.upsert('test', { docType: 'test' })).rejects.toThrow(/document store does not provide an implementation of 'upsert'/)
})

test('A doc store with erroring functions will throw erroring function errors.', async () => {
  const safeDocStore = wrapDocStore(docStoreWithErroringFunctions)
  await expect(safeDocStore.deleteById('test', '123')).rejects.toThrow(JsonotronDocStoreFailureError)
  await expect(safeDocStore.deleteById('test', '123')).rejects.toThrow(/'deleteById' raised an error.[\n]Error: A/)
  await expect(safeDocStore.exists('test', '123')).rejects.toThrow(/'exists' raised an error.[\n]Error: A2/)
  await expect(safeDocStore.fetch('test', '123')).rejects.toThrow(/'fetch' raised an error.[\n]Error: B/)
  await expect(safeDocStore.queryAll('test', ['id'])).rejects.toThrow(/'queryAll' raised an error.[\n]Error: C/)
  await expect(safeDocStore.queryByFilter('test', ['id'], 'A and B')).rejects.toThrow(/'queryByFilter' raised an error.[\n]Error: D/)
  await expect(safeDocStore.queryByIds('test', ['id'], ['123', '234'])).rejects.toThrow(/'queryByIds' raised an error.[\n]Error: E/)
  await expect(safeDocStore.upsert('test', { docType: 'test' })).rejects.toThrow(/'upsert' raised an error.[\n]Error: F/)
})

test('A doc store with invalid function responses will throw errors.', async () => {
  const safeDocStore = wrapDocStore(docStoreWithFunctionsWithInvalidReturns)
  await expect(safeDocStore.deleteById('test', '123')).rejects.toThrow(JsonotronDocStoreInvalidResponseError)
  await expect(safeDocStore.exists('test', '123')).rejects.toThrow(JsonotronDocStoreUnrecognisedErrorCodeError)
  await expect(safeDocStore.queryByIds('test', ['id'], ['123', '234'])).rejects.toThrow(JsonotronDocStoreInvalidResponseError)
  await expect(safeDocStore.upsert('test', { docType: 'test' })).rejects.toThrow(JsonotronRequiredVersionNotAvailableError)
})

test('A doc store with an invalid response to the exists function will throw an error.', async () => {
  const storeExists = wrapDocStore(docStoreWithMalformedExists)
  await expect(storeExists.exists('test', '123')).rejects.toThrow(/Property 'found' must be a boolean/)
})

test('A doc store with an invalid response to the fetch function will throw an error.', async () => {
  const storeFetch = wrapDocStore(docStoreWithMalformedFetch)
  await expect(storeFetch.fetch('test', '123')).rejects.toThrow(/Property 'doc' must be an object/)
  const storeId = wrapDocStore(docStoreWithMalformedDocId)
  await expect(storeId.fetch('test', '123')).rejects.toThrow(/an 'id' string property/)
  const storeWrongId = wrapDocStore(docStoreWithWrongDocId)
  await expect(storeWrongId.fetch('test', '123')).rejects.toThrow(/must have the requested 'id'/)
  const storeDocType = wrapDocStore(docStoreWithMalformedDocType)
  await expect(storeDocType.fetch('test', '123')).rejects.toThrow(/a 'docType' property of the expected type 'test'/)
  const storeDocVersion = wrapDocStore(docStoreWithMalformedDocVersion)
  await expect(storeDocVersion.fetch('test', '123')).rejects.toThrow(/a 'docVersion' string property/)
  const storeDocOps = wrapDocStore(docStoreWithMalformedDocOps)
  await expect(storeDocOps.fetch('test', '123')).rejects.toThrow(/a 'docOps' array property/)
})

test('A doc store with an invalid response to the queryAll function will throw an error.', async () => {
  const storeQueryAll = wrapDocStore(docStoreWithMalformedQueryAll)
  await expect(storeQueryAll.queryAll('test', ['id', 'docType', 'docVersion', 'docOps'])).rejects.toThrow(/Property 'docs' must be an array/)
  const storeId = wrapDocStore(docStoreWithMalformedDocsId)
  await expect(storeId.queryAll('test', ['id', 'docType', 'docVersion', 'docOps'])).rejects.toThrow(/doc property 'id' must be a string/)
  const storeDocType = wrapDocStore(docStoreWithMalformedDocsType)
  await expect(storeDocType.queryAll('test', ['id', 'docType', 'docVersion', 'docOps'])).rejects.toThrow(/doc property 'docType' must match requested type 'test'/)
  const storeDocVersion = wrapDocStore(docStoreWithMalformedDocsVersion)
  await expect(storeDocVersion.queryAll('test', ['id', 'docType', 'docVersion', 'docOps'])).rejects.toThrow(/doc property 'docVersion' must be a string/)
  const storeDocOps = wrapDocStore(docStoreWithMalformedDocsOps)
  await expect(storeDocOps.queryAll('test', ['id', 'docType', 'docVersion', 'docOps'])).rejects.toThrow(/doc property 'docOps' must be an array/)
})

test('A doc store with valid functions will return the underlying function return value.', async () => {
  const safeDocStore = wrapDocStore(docStoreWithValidFunctions)
  await expect(safeDocStore.deleteById('test', '123')).resolves.not.toThrow()
  await expect(safeDocStore.exists('test', '123')).resolves.toEqual(true)
  await expect(safeDocStore.fetch('test', '123')).resolves.toEqual({ id: '123', docType: 'test', docVersion: 'aaaa', docOps: [] })
  await expect(safeDocStore.queryAll('test', ['id'])).resolves.not.toThrow()
  await expect(safeDocStore.queryByFilter('test', ['id'], 'A and B')).resolves.not.toThrow()
  await expect(safeDocStore.queryByIds('test', ['id'], ['123', '234'])).resolves.not.toThrow()
  await expect(safeDocStore.upsert('test', { docType: 'test' })).resolves.not.toThrow()
})

test('Upserts will fail if the doc types are not consistent.', async () => {
  const safeDocStore = wrapDocStore(docStoreWithValidFunctions)
  await expect(safeDocStore.upsert('test', { docType: 'notTest' })).rejects.toThrow(JsonotronInternalError)
  await expect(safeDocStore.upsert('test', { docType: 'notTest' })).rejects.toThrow(/does not match docTypeName/)
})

import { expect, test } from '@jest/globals'
import { SengiClientUnexpectedError } from '../src'
import { createClient, createErrorFetchFunc } from './shared.test'

test('An error is thrown if createDocument does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.createDocument({
      docTypePluralName: 'docTypePluralName',
      newDocumentId: '1234',
      constructorParams: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if deleteDocumentById does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.deleteDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: '1234'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if getDocumentById does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: '1234',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if operateOnDocument (without a required version) does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.operateOnDocument({
      docTypePluralName: 'docTypePluralName',
      operationId: '1234',
      documentId: '1234',
      operationName: 'operation-name',
      operationParams: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if patchDocument (without a required version) does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.patchDocument({
      docTypePluralName: 'docTypePluralName',
      operationId: '1234',
      documentId: '1234',
      patch: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if queryAllDocuments does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.queryAllDocuments({
      docTypePluralName: 'docTypePluralName',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if queryDocumentsByFilter does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.queryDocumentsByFilter({
      docTypePluralName: 'docTypePluralName',
      filterName: 'filter-name',
      filterParams: { filter: 'params' },
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if queryDocumentById does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.queryDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: '1234',
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if queryDocumentsByIds does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.queryDocumentsByIds({
      docTypePluralName: 'docTypePluralName',
      documentIds: ['1234', '5678'],
      fieldNames: ['id']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if upsertDocument does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.upsertDocument({
      docTypePluralName: 'docTypePluralName',
      document: { id: '1234' }
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if getEnumTypeOverviews does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.getEnumTypeOverviews()
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

test('An error is thrown if getDocTypeOverviews does not work.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.getDocTypeOverviews()
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/not working/)
  }
})

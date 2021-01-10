import { expect, test } from '@jest/globals'
import { SengiClientGatewayError, SengiClientInvalidInputError, SengiClientRequiredVersionNotAvailableError, SengiClientUnexpectedError, SengiClientUnrecognisedPathError } from '../src'
import { createClient, createErrorFetchFunc } from './shared.test'

test('400 - An error is thrown if the input parameters are not valid.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(400, 'missing param')
    const client = createClient(fetchFunc)
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      fieldNames: ['some', 'field', 'names']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientInvalidInputError)
    expect(err.message).toMatch(/missing param/)
  }
})

test('404 - An error is thrown if the path is invalid, such as when docTypePluralName is not recognised or the id is invalid.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(404, 'path is not recognised')
    const client = createClient(fetchFunc)
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      fieldNames: ['some', 'field', 'names']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnrecognisedPathError)
    expect(err.message).toMatch(/path component of the url/)
    expect(err.message).toMatch(/docTypePluralName/)
  }
})

test('404 - An error is thrown if the enum type is not recognised.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(404, 'not available')
    const client = createClient(fetchFunc)
    await client.getEnumTypeItems({
      fullyQualifiedEnumTypeName: 'unknown-enum-type'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnrecognisedPathError)
    expect(err.message).toMatch(/path component of the url/)
  }
})

test('412 - An error is thrown if the required doc version is not available.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(412, 'not available')
    const client = createClient(fetchFunc)
    await client.patchDocument({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      operationId: '1234',
      patch: {},
      reqVersion: 'abc'
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientRequiredVersionNotAvailableError)
    expect(err.message).toMatch(/required version of the document is not available/)
  }
})

test('500 - An error is thrown if an unexpected error is raised.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'internal error')
    const client = createClient(fetchFunc)
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      fieldNames: ['some', 'field', 'names']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/internal error/)
  }
})

test('503 - An error is thrown if the service is unavailable after retries.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(503, 'gateway down')
    const client = createClient(fetchFunc)
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      fieldNames: ['some', 'field', 'names']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientGatewayError)
  }
})

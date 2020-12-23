import { expect, test } from '@jest/globals'
import { SengiClientGatewayError, SengiClientInvalidInputError, SengiClientUnexpectedError, SengiClientUnrecognisedPathError } from '../src'
import { createClient, createErrorFetchFunc } from './shared.test'

test('An error is thrown if the document does not have an id.', async () => {
  try {
    const client = createClient()
    await client.saveNewDocument('docTypePluralName', {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toMatch(/Document must have id/)
  }
})

test('An error is thrown if the input parameters are not valid.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(400, 'missing param')
    const client = createClient(fetchFunc)
    await client.saveNewDocument('docTypePluralName', { id: '123', foo: 'bar' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientInvalidInputError)
    expect(err.message).toMatch(/missing param/)
  }
})

test('An error is thrown if the document type is not recognised.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(404, 'not recognised')
    const client = createClient(fetchFunc)
    await client.saveNewDocument('docTypePluralName', { id: '123', foo: 'bar' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnrecognisedPathError)
    expect(err.message).toMatch(/path component of the url/)
    expect(err.message).toMatch(/docTypePluralName/)
  }
})

test('An error is thrown if an unexpected error is raised.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'internal error')
    const client = createClient(fetchFunc)
    await client.saveNewDocument('docTypePluralName', { id: '123', foo: 'bar' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientUnexpectedError)
    expect(err.message).toMatch(/internal error/)
  }
})

test('An error is thrown if the service is unavailable after retries.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(503, 'gateway down')
    const client = createClient(fetchFunc)
    await client.saveNewDocument('docTypePluralName', { id: '123', foo: 'bar' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiClientGatewayError)
  }
})

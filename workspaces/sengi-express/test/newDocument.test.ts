import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('201 - create a new document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/records/films/00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
  expect(docs[2]).toEqual({
    id: '00000000-0000-0000-0000-000000000001',
    docType: 'film',
    docVersion: 'xxxx',
    docOpIds: [],
    docCreatedByUserId: "testUser",
    docCreatedMillisecondsSinceEpoch: 1629883680000,
    docLastUpdatedByUserId: "testUser",
    docLastUpdatedMillisecondsSinceEpoch: 1629883680000,
    filmTitle: 'Frozen'
  })
})

test('201 - create a new document with an explicit id in the request-id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('x-request-id', 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/records/films/abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
  expect(docs[2]).toEqual({
    id: 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd',
    docType: 'film',
    docVersion: 'xxxx',
    docOpIds: [],
    docCreatedByUserId: "testUser",
    docCreatedMillisecondsSinceEpoch: 1629883680000,
    docLastUpdatedByUserId: "testUser",
    docLastUpdatedMillisecondsSinceEpoch: 1629883680000,
    filmTitle: 'Frozen'
  })
})

test('201 - create a new document with an explicit id in the document body', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'e09fa312-ece2-47d7-8a6b-d0b6598a9083', filmTitle: 'Frozen' })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/records/films/e09fa312-ece2-47d7-8a6b-d0b6598a9083')
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
  expect(docs[2]).toEqual({
    id: 'e09fa312-ece2-47d7-8a6b-d0b6598a9083',
    docType: 'film',
    docVersion: 'xxxx',
    docOpIds: [],
    docCreatedByUserId: "testUser",
    docCreatedMillisecondsSinceEpoch: 1629883680000,
    docLastUpdatedByUserId: "testUser",
    docLastUpdatedMillisecondsSinceEpoch: 1629883680000,
    filmTitle: 'Frozen'
  })
})

test('201 - ignore a request to create a new document with a previously used id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('x-request-id', 'ba8f06b4-9b41-4e71-849c-484433afee79')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
  expect(response.header['sengi-document-operation-type']).toEqual('none')
  expect(docs).toHaveLength(2)
  expect(docs[0]).toEqual({
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'film',
    docVersion: 'xyz',
    docOpIds: ['0000d8e8-70b5-4968-8fc8-f9ef8b150000'],
    filmTitle: 'Die Hard',
    durationInMinutes: 105,
    castMembers: [],
    totalCastSize: 0
  })
})

test('400 - fail to create a new document with missing required doc fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({})

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/required property 'filmTitle'/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to create a new document with a missing api key', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/specify an X-API-KEY/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to create a new document when request id and doc id conflict', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('x-request-id', 'ee8afee7-4d02-4472-9380-d45f33d5944b')
    .send({ id: '5b20018a-6918-4e77-acee-5ba982eb1105', filmTitle: 'Frozen' })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/not match the id of the request/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to create a new document with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to create a new document in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/unknown')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to create a new document using the PUT method', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ filmTitle: 'Frozen' })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'PUT' is not valid /)
  expect(docs).toHaveLength(2)
})

test('415 - fail to create a document with invalid content-type headers', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('content-type', 'application/xml')
    .send('<?xml version="1.0" encoding="UTF-8"?><root />')

  expect(response.status).toEqual(415)
  expect(response.text).toMatch(/Cannot read payloads/)
  expect(docs).toHaveLength(2)
})

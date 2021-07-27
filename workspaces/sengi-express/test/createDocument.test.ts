import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('201 - create a document with a constructor', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ title: 'Cloudy' })

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
    filmTitle: 'Cloudy',
    durationInMinutes: 15
  })
})

test('201 - create a document with a constructor and with an explicit id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('x-request-id', 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
    .send({ title: 'Cloudy' })

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
    filmTitle: 'Cloudy',
    durationInMinutes: 15
  })
})

test('201 - create a document with a constructor and with a previously used id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('x-request-id', 'ba8f06b4-9b41-4e71-849c-484433afee79')
    .send({ title: 'Cloudy' })

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

test('400 - fail to create document with missing constructor fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({})

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/required property 'title'/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to create document with a constructor and with a missing api key', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .send({ title: 'Cloudy' })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/specify an X-API-KEY/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to create document with a constructor and with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')
    .send({ title: 'Cloudy' })

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to create document with a constructor in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/unknown:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ title: 'Cloudy' })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to create a document with a constructor and using the PUT method', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ title: 'Cloudy' })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'PUT' is not valid /)
  expect(docs).toHaveLength(2)
})

test('415 - fail to create a document with a constructor and with invalid content-type headers', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films:makeShort')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .set('content-type', 'application/xml')
    .send('<?xml version="1.0" encoding="UTF-8"?><root />')

  expect(response.status).toEqual(415)
  expect(response.text).toMatch(/Cannot read payloads/)
  expect(docs).toHaveLength(2)
})

import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('201 - create a new document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'admin')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87, initialCastMembers: ['Idina Menzel', 'Kristen Bell'] })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/films/00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
  expect(docs[2]).toEqual({
    id: '00000000-0000-0000-0000-000000000001',
    docType: 'film',
    docVersion: 'xxxx',
    docOps: [],
    filmTitle: 'Frozen',
    durationInMinutes: 87,
    castMembers: [
      'Idina Menzel',
      'Kristen Bell'
    ],
    totalCastSize: 2
  })
})

test('201 - create a new document with an explicit id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'admin')
    .set('x-request-id', 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87, initialCastMembers: ['Tom', 'Dick', 'Harry'] })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/films/abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
  expect(docs[2]).toEqual({
    id: 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd',
    docType: 'film',
    docVersion: 'xxxx',
    docOps: [],
    filmTitle: 'Frozen',
    durationInMinutes: 87,
    castMembers: ['Tom', 'Dick', 'Harry'],
    totalCastSize: 3
  })
})

test('201 - create a new document with a previously used id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'admin')
    .set('x-request-id', 'ba8f06b4-9b41-4e71-849c-484433afee79')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87 })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({})
  expect(response.header.location).toEqual('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79')
  expect(response.header['sengi-document-operation-type']).toEqual('none')
  expect(docs).toHaveLength(2)
  expect(docs[0]).toEqual({
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'film',
    docVersion: 'xyz',
    docOps: [{
      opId: '0000d8e8-70b5-4968-8fc8-f9ef8b150000',
      style: 'patch'
    }],
    filmTitle: 'Die Hard',
    durationInMinutes: 105,
    castMembers: [],
    totalCastSize: 0
  })
})

test('400 - fail to create new document with missing constructor fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'admin')
    .send({ initialCastMembers: [], filmTitle: 'Frozen' })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/initialDurationInMinutes/)
  expect(response.text).toMatch(/Field is required/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to create a new document with missing X-ROLE-NAMES header', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87, initialCastMembers: [] })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/X-ROLE-NAMES/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to create document with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'none')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87 })

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to create document in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/unknown')
    .set('x-role-names', 'admin')
    .set('x-user-id', 'testUser')
    .send({ fieldA: 1, fieldB: true })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/doc-type name 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to create a new document using PUT method', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/films')
    .set('x-role-names', 'admin')
    .send({ filmTitle: 'Frozen', initialDurationInMinutes: 87 })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'PUT' is not valid /)
  expect(docs).toHaveLength(2)
})

test('415 - fail to create a new document with invalid content-type headers', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films')
    .set('x-role-names', 'admin')
    .set('content-type', 'application/xml')
    .send('<?xml version="1.0" encoding="UTF-8"?><root />')

  expect(response.status).toEqual(415)
  expect(response.text).toMatch(/Cannot read payloads/)
  expect(docs).toHaveLength(2)
})

import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get a document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79?fields=filmTitle,durationInMinutes,unknownField')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    doc: {
      filmTitle: 'Die Hard',
      durationInMinutes: 105
    }
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get a document id if no fields specified', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    doc: {
      id: 'ba8f06b4-9b41-4e71-849c-484433afee79'
    }
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('403 - fail to get a document due to insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79?fields=filmTitle,durationInMinutes')
    .set('x-role-names', 'none')

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get a document of a known type but unknown id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/unknown_id?fields=filmTitle,durationInMinutes')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/unknown_id/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get a document of an unknown document type', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/unknown/ba8f06b4-9b41-4e71-849c-484433afee79?fields=filmTitle,durationInMinutes')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

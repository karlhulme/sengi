import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get documents by parameterised filter', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byDuration&filterParams={"minDuration":100}')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with non-parameterised filter', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byEmptyCast')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with non-parameterised filter that includes empty filter params', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byEmptyCast&filterParams={}')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents by filter without specifying fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?filterName=byEmptyCast')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('400 - fail to get documents for an unknown filter', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byInvalidFilter&filterParams={"minDuration":100}')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/does not define a filter named 'byInvalidFilter'/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to get documents by filter with malformed filter JSON parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byDuration&filterParams={invalid_params}')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/cannot be parsed into a JSON object/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to get documents by filter with invalid filter JSON parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&filterName=byDuration&filterParams={"missingMinDuration":80}')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/required property 'minDuration'/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to get documents by filter with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?filterName=byEmptyCast')
    .set('x-role-names', 'none')

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get documents by filter from an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/unknown?filterName=byEmptyCast')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

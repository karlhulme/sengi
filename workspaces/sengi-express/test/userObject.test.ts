import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('400 - fail to get a document if user object missing', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79?fields=filmTitle,durationInMinutes,unknownField')
    .set('x-api-key', 'adminKey')

  expect(response.status).toEqual(400)
  expect(response.text).toContain('request did not specify an X-USER')
})

test('400 - fail to get a document if user object is malformed', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79?fields=filmTitle,durationInMinutes,unknownField')
    .set('x-api-key', 'adminKey')
    .set('x-user', 'this-is-not-a-json-object')

  expect(response.status).toEqual(400)
  expect(response.text).toContain('not be parsed as a JSON object')
})

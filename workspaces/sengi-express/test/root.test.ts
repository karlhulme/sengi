import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - root', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.text).toMatch(/service is running/)
})

test('405 - invalid verb', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root')
    .send({})

  expect(response.status).toEqual(405)
})

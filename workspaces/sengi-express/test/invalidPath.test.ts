import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('404 - invalid path', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/route/to/nowhere')
    .set('x-api-key', 'adminKey')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/does not point to a recognised resource/)
})

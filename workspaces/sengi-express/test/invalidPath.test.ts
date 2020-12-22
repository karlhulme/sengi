import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('404 - invalid path', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/route/to/nowhere')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/does not point to a recognised resource/)
})

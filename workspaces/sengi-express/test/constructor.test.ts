import express from 'express'
import supertest from 'supertest'
import { test, expect } from '@jest/globals'
import { MemDocStore } from 'sengi-docstore-mem'
import { createSengiExpress } from '../src'

test('A sengi express can be constructed without providing any custom callbacks or types.', async () => {
  const memDocStore = new MemDocStore({ docs: [], generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docStore: memDocStore
  })

  const testableApp = express()
  testableApp.use('/', sengiExpress)

  const response = await supertest(testableApp).get('/')
  expect(response.status).toEqual(200)
})

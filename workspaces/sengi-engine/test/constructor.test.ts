import { test, expect } from '@jest/globals'
import { Sengi } from '../src'

test('Fail to create a Sengi if a doc store is not provided.', async () => {
  expect(() => new Sengi({})).toThrow(/Must supply a docStore./)
})

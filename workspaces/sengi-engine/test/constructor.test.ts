import { test, expect } from '@jest/globals'
import { Sengi } from '../src'

test('Must supply a doc store to the Sengi constructor.', async () => {
  expect(() => new Sengi({})).toThrow(/Must supply a docStore./)
})

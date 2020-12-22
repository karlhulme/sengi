import { test, expect } from '@jest/globals'
import { Sengi } from '../src'

test('Must supply a doc store to the constructor.', async () => {
  try {
    new Sengi({})
  } catch (err) {
    expect(err.message).toContain('Must supply a docStore')
  }
})

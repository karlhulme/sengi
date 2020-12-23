import { expect, test } from '@jest/globals'
import { SengiClient } from '../src'

test('Constructor fails if nothing supplied', async () => {
  try {
    new SengiClient()
    throw new Error('fail')
  } catch (err) {
    expect(err.message).toMatch(/constructor props object must be supplied/)
  }
})

test('Constructor fails if url not supplied', async () => {
  try {
    new SengiClient({ roleNames: ['general'] })
    throw new Error('fail')
  } catch (err) {
    expect(err.message).toMatch(/url must be supplied/)
  }
})

test('Constructor fails if roleNames nothing supplied', async () => {
  try {
    new SengiClient({ url: 'http://test.com' })
    throw new Error('fail')
  } catch (err) {
    expect(err.message).toMatch(/roleNames array must be supplied/)
  }
})

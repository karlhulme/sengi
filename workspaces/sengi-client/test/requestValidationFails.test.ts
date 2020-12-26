import { expect, test } from '@jest/globals'
import { createClient, createErrorFetchFunc } from './shared.test'

test('An error is thrown if upsertDocument is called with a doc with no id field.', async () => {
  try {
    const fetchFunc = createErrorFetchFunc(500, 'not working')
    const client = createClient(fetchFunc)
    await client.upsertDocument({
      docTypePluralName: 'docTypePluralName',
      document: {}
    })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toMatch(/Document must have id/)
  }
})

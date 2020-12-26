import { expect, test } from '@jest/globals'
import { SengiClient } from '../src'

test('Return fetch errors to the client if retries fail.', async () => {
  const client = new SengiClient({
    fetch: () => { throw new Error('problem') },
    retryIntervals: [100, 200],
    roleNames: ['general'],
    url: 'http://test.com'
  })

  try {
    await client.getDocumentById({
      docTypePluralName: 'docTypePluralName',
      documentId: 'document-id',
      fieldNames: ['some', 'field', 'names']
    })
    throw new Error('fail')
  } catch (err) {
    expect(err.message).toMatch(/problem/)
  }
})

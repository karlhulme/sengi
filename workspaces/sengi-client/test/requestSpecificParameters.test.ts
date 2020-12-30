import { expect, jest, test } from '@jest/globals'
import { FetchFunc } from '../src'
import { createClient } from './shared.test'

test('Request path components will be added to the base url.', async () => {
  const fetchFunc = jest.fn(async () => ({ status: 201 }))
  const client = createClient(fetchFunc as unknown as FetchFunc)
  await client.createDocument({
    docTypePluralName: 'myDocTypePluralName',
    newDocumentId: 'document-id',
    constructorParams: {},
    pathComponents: ['additional', 'path', 'components']
  })
  expect(fetchFunc).toBeCalledTimes(1)
  expect(fetchFunc).toBeCalledWith('http://test.com/additional/path/components/myDocTypePluralName/', expect.objectContaining({
    headers: expect.objectContaining({
      'x-role-names': 'general'
    })
  }))
})

test('Request role names will be used in place of init ones.', async () => {
  const fetchFunc = jest.fn(async () => ({ status: 201 }))
  const client = createClient(fetchFunc as unknown as FetchFunc)
  await client.createDocument({
    docTypePluralName: 'myDocTypePluralName',
    newDocumentId: 'document-id',
    constructorParams: {},
    roleNames: ['bespoke', 'account']
  })
  expect(fetchFunc).toBeCalledTimes(1)
  expect(fetchFunc).toBeCalledWith('http://test.com/myDocTypePluralName/', expect.objectContaining({
    headers: expect.objectContaining({
      'x-role-names': 'bespoke,account'
    })
  }))
})


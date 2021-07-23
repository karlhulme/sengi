import { test, expect } from '@jest/globals'
import { Sengi } from '../src'
import { createMockStore } from './shared.test'

test('Fail to create a Sengi if a doc store is not provided.', () => {
  expect(() => new Sengi({})).toThrow(/Must supply a docStore./)
})

test('Create a sengi with a client that uses environment variable based api keys.', () => {
  process.env.ADMIN_PRIMARY_KEY = 'aaaa'
  process.env.ADMIN_SECONDARY_KEY = 'bbbb'

  const sengi = new Sengi({
    clients: [{
      name: 'admin',
      docPermissions: true,
      apiKeys: ['$ADMIN_PRIMARY_KEY', '$ADMIN_SECONDARY_KEY']
    }],
    docStore: createMockStore()
  })

  expect(sengi.getApiKeysLoadedFromEnvCount()).toEqual(2)
  expect(sengi.getApiKeysNotFoundInEnvCount()).toEqual(0)
})

test('Create a sengi with a client that uses environment variable based api keys that do not exist.', () => {
  const sengi = new Sengi({
    clients: [{
      name: 'admin',
      docPermissions: true,
      apiKeys: ['$ADMIN_NON_EXISTENT_PRIMARY_KEY', '$ADMIN_NON_EXISTENT_SECONDARY_KEY']
    }],
    docStore: createMockStore()
  })
  
  expect(sengi.getApiKeysLoadedFromEnvCount()).toEqual(0)
  expect(sengi.getApiKeysNotFoundInEnvCount()).toEqual(2)
})

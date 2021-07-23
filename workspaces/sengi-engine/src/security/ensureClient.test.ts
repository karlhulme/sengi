import { expect, test } from '@jest/globals'
import { Client } from 'sengi-interfaces'
import { ensureClient } from './ensureClient'

const clients: Client[] = [{
  name: 'aClient',
  docPermissions: true,
  apiKeys: ['adminKey']
}]

test('Can find a valid client.', () => {
  expect(ensureClient('adminKey', clients)).toEqual({
    name: 'aClient',
    docPermissions: true
  })
})

test('Error raised if client cannot be found based on api key.', () => {
  expect(() => ensureClient('unknown', clients)).toThrow()
})

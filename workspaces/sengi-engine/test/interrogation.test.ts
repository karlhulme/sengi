import { test, expect } from '@jest/globals'
import { createSengiWithMockStore } from './shared.test'

test('Fetch the singular doc type name from the plural name.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocTypeNameFromPluralName('cars')).toEqual('car')
  expect(sengi.getDocTypeNameFromPluralName('unknowns')).toEqual(null)
})

test('Fetch the plural doc type name from the singular name.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocTypePluralNameFromName('car')).toEqual('cars')
  expect(sengi.getDocTypePluralNameFromName('unknown')).toEqual(null)
})

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

test('Fetch the array of doc types.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocTypes()).toEqual([
    { name: 'car', pluralName: 'cars', title: 'Car', pluralTitle: 'Cars', summary: 'A car' },
    { name: 'person', pluralName: 'persons', title: 'Person', pluralTitle: 'Persons', summary: 'A person document' }
  ])
})

test('Fetch a doc type definition.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocType('car')).toBeDefined()
  expect(sengi.getDocType('person')).toBeDefined()
})

test('Fail to find an unknown doc type definition.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocType('madeup')).toEqual(null)
})

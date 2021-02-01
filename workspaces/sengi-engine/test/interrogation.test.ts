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

test('Fetch the array of enum type overviews.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getEnumTypes()).toEqual([
    { domain: 'https://jsonotron.org', system: 'jss', name: 'dayOfWeek', title: 'Day of Week' }
  ])
})

test('Fetch an enum type definition.', async () => {
  const { sengi } = createSengiWithMockStore()
  // console.log(JSON.stringify(sengi.getEnumType('https://jsonotron.org/jss/dayOfWeek'), null, 2))
  expect(sengi.getEnumType('https://jsonotron.org/jss/dayOfWeek')).toEqual({
    domain: 'https://jsonotron.org',
    system: 'jss',
    name: 'dayOfWeek',
    title: 'Day of Week',
    documentation: 'A day of the week.',
    items: expect.arrayContaining([
      expect.objectContaining({ value: 'su', text: 'Sunday' })
    ])
  })
})

test('Fail to find an unknown enum type definition.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getEnumType('https://jsonotron.org/jss/unknown')).toEqual(null)
})

test('Fetch the array of doc types.', async () => {
  const { sengi } = createSengiWithMockStore()
  expect(sengi.getDocTypes()).toEqual([
    { name: 'car', pluralName: 'cars', title: 'Car', pluralTitle: 'Cars', summary: 'A car' },
    { name: 'person', pluralName: 'persons', title: 'Person', pluralTitle: 'Persons', summary: 'A person document' }
  ])
})

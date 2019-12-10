/* eslint-env jest */
const createDocStoreOptions = require('./createDocStoreOptions')

const docTypeWithDocStoreOptions = {
  docStoreOptions: {
    propA: 'valueA'
  }
}

const docTypeWithoutDocStoreOptions = {}

test('Return doc store options combined with request options.', () => {
  expect(createDocStoreOptions(docTypeWithDocStoreOptions, null)).toEqual({ propA: 'valueA' })
  expect(createDocStoreOptions(docTypeWithDocStoreOptions, { propB: 'valueB' })).toEqual({ propA: 'valueA', propB: 'valueB' })
})

test('Return doc request options where there are no doc store options.', () => {
  expect(createDocStoreOptions(docTypeWithoutDocStoreOptions, null)).toEqual({})
  expect(createDocStoreOptions(docTypeWithoutDocStoreOptions, { propB: 'valueB' })).toEqual({ propB: 'valueB' })
})

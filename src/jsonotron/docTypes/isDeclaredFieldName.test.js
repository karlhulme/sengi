/* eslint-env jest */
const isDeclaredFieldName = require('./isDeclaredFieldName')

const docType = {
  fields: {
    hello: {},
    world: {}
  },
  calculatedFields: {
    fullAddress: {},
    displayName: {}
  }
}

test('Recognise declared field names.', () => {
  expect(isDeclaredFieldName(docType, 'hello')).toEqual(true)
  expect(isDeclaredFieldName(docType, 'world')).toEqual(true)

  expect(isDeclaredFieldName(docType, 'fullAddress')).toEqual(false)
  expect(isDeclaredFieldName(docType, 'displayName')).toEqual(false)
})

/* eslint-env jest */
import { isCalculatedFieldName } from './isCalculatedFieldName'

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

const docTypeWithNoCalculatedFields = {
  fields: {
    hello: {},
    world: {}
  }
}

test('Recognise calculated field names.', () => {
  expect(isCalculatedFieldName(docType, 'fullAddress')).toEqual(true)
  expect(isCalculatedFieldName(docType, 'displayName')).toEqual(true)
})

test('Recognise non-calculated field names', () => {
  expect(isCalculatedFieldName(docType, 'hello')).toEqual(false)
  expect(isCalculatedFieldName(docType, 'world')).toEqual(false)
  expect(isCalculatedFieldName(docTypeWithNoCalculatedFields, 'hello')).toEqual(false)
  expect(isCalculatedFieldName(docTypeWithNoCalculatedFields, 'world')).toEqual(false)
})

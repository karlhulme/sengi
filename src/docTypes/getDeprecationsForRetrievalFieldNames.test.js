/* eslint-env jest */
const getDeprecationsForRetrievalFieldNames = require('./getDeprecationsForRetrievalFieldNames')

const docType = {
  fields: {
    height: {},
    weight: { isDeprecated: true },
    age: { isDeprecated: true },
    eyeColor: {}
  }
}

test('Retrieve deprecations for retrieval fields.', () => {
  expect(getDeprecationsForRetrievalFieldNames(docType, ['id', 'height', 'weight'])).toEqual({ weight: { reason: 'This field has been deprecated.' } })
  expect(getDeprecationsForRetrievalFieldNames(docType, ['docType', 'age', 'eyeColor'])).toEqual({ age: { reason: 'This field has been deprecated.' } })
  expect(getDeprecationsForRetrievalFieldNames(docType, ['sys', 'height', 'eyeColor'])).toEqual({})
  expect(getDeprecationsForRetrievalFieldNames(docType, ['docVersion', 'weight', 'age'])).toEqual({ age: { reason: 'This field has been deprecated.' }, weight: { reason: 'This field has been deprecated.' } })
})

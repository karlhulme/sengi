/* eslint-env jest */
const getDeprecationsForRetrievalFieldNames = require('./getDeprecationsForRetrievalFieldNames')

const docType = {
  fields: {
    height: {},
    weight: { deprecation: 'It is rude to ask.' },
    age: { deprecation: 'Forever 21.' },
    eyeColor: {}
  }
}

test('Retrieve deprecations for retrieval fields.', () => {
  expect(getDeprecationsForRetrievalFieldNames(docType, ['id', 'height', 'weight'])).toEqual({ weight: { reason: 'It is rude to ask.' } })
  expect(getDeprecationsForRetrievalFieldNames(docType, ['docType', 'age', 'eyeColor'])).toEqual({ age: { reason: 'Forever 21.' } })
  expect(getDeprecationsForRetrievalFieldNames(docType, ['sys', 'height', 'eyeColor'])).toEqual({})
  expect(getDeprecationsForRetrievalFieldNames(docType, ['docVersion', 'weight', 'age'])).toEqual({ age: { reason: 'Forever 21.' }, weight: { reason: 'It is rude to ask.' } })
})

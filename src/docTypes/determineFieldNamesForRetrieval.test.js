/* eslint-env jest */
const { JsonotronUnrecognisedFieldNameError } = require('../errors')
const determineFieldNamesForRetrieval = require('./determineFieldNamesForRetrieval')

const docType = {
  name: 'test',
  fields: {
    a: {},
    b: {},
    c: {}
  },
  calculatedFields: {
    combined: {
      inputFields: ['a', 'b']
    },
    noInputs: {}
  }
}

test('Identify system fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(docType, ['id'])).toEqual(['id'])
  expect(determineFieldNamesForRetrieval(docType, ['id', 'id'])).toEqual(['id'])
  expect(determineFieldNamesForRetrieval(docType, ['docType'])).toEqual(['docType'])
  expect(determineFieldNamesForRetrieval(docType, ['id', 'docOps'])).toEqual(['id', 'docOps'])
})

test('Identify declared fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(docType, ['a', 'b'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(docType, ['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  expect(determineFieldNamesForRetrieval(docType, ['a', 'a', 'a'])).toEqual(['a'])
})

test('Identify calculated fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(docType, ['combined'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(docType, ['combined', 'combined'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(docType, ['noInputs'])).toEqual([])
})

test('Fail to identify fields for retrieval that are neither declared, calculated or system.', () => {
  expect(() => determineFieldNamesForRetrieval(docType, ['invalid'])).toThrow(JsonotronUnrecognisedFieldNameError)
  expect(() => determineFieldNamesForRetrieval(docType, ['invalid'])).toThrow(/invalid/)
})

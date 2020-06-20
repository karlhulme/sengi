/* eslint-env jest */
const evaluateFilter = require('./evaluateFilter')
const {
  JsonotronUnrecognisedFilterNameError,
  JsonotronFilterFailedError
} = require('jsonotron-errors')

const docType = {
  name: 'example',
  filters: {
    byNumber: {
      implementation: input => input.a * 2
    },
    byInputType: {
      implementation: input => (typeof input)
    },
    faulty: {
      implementation: input => { throw new Error('bad') }
    }
  }
}

const docTypeWithNoFilters = {
  name: 'example2'
}

test('Evaluate a doc type filter with valid parameters.', () => {
  expect(evaluateFilter(docType, 'byNumber', { a: 123 })).toEqual(246)
  expect(evaluateFilter(docType, 'byInputType')).toEqual('object')
})

test('Evaluating an unknown doc type filter raises an error.', () => {
  expect(() => evaluateFilter(docType, 'madeup', { a: 123 })).toThrow(/madeup/)
  expect(() => evaluateFilter(docTypeWithNoFilters, 'madeup', { a: 123 })).toThrow(JsonotronUnrecognisedFilterNameError)
})

test('Evaluating a faulty doc type filter raises an error.', () => {
  expect(() => evaluateFilter(docType, 'faulty', { a: 123 })).toThrow(/Error: bad/)
  expect(() => evaluateFilter(docType, 'faulty', { a: 123 })).toThrow(JsonotronFilterFailedError)
})

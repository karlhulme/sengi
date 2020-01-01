/* eslint-env jest */
const ensureFilterName = require('./ensureFilterName')
const { JsonotronUnrecognisedFilterNameError } = require('../errors')

const docType = {
  name: 'testDocType',
  filters: {
    byA: {},
    byB: {}
  }
}

const docTypeWithNoFilters = {
  name: 'testDocType'
}

test('Accept recognised filter names.', () => {
  expect(() => ensureFilterName(docType, 'byA')).not.toThrow()
  expect(() => ensureFilterName(docType, 'byB')).not.toThrow()
})

test('Reject unrecognised filter names.', () => {
  expect(() => ensureFilterName(docType, 'byInvalid')).toThrow(JsonotronUnrecognisedFilterNameError)
  expect(() => ensureFilterName(docTypeWithNoFilters, 'byInvalid')).toThrow(JsonotronUnrecognisedFilterNameError)
})

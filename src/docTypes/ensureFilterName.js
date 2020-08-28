const check = require('check-types')
const { JsonotronUnrecognisedFilterNameError } = require('jsonotron-errors')

/**
 * Ensure that the given filter name is a filter defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} filterName The name of a filter.
 */
const ensureFilterName = (docType, filterName) => {
  check.assert.object(docType)
  check.assert.object(docType.filters)
  check.assert.string(filterName)

  if (!docType.filters[filterName]) {
    throw new JsonotronUnrecognisedFilterNameError(docType.name, filterName)
  }
}

module.exports = ensureFilterName

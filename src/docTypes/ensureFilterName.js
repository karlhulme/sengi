const getFilterNames = require('./getFilterNames')
const { JsonotronUnrecognisedFilterNameError } = require('jsonotron-errors')

/**
 * Ensure that the given filter name is a filter defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} filterName The name of a filter.
 */
const ensureFilterName = (docType, filterName) => {
  const filterNames = getFilterNames(docType)

  if (!filterNames.includes(filterName)) {
    throw new JsonotronUnrecognisedFilterNameError(docType.name, filterName)
  }
}

module.exports = ensureFilterName

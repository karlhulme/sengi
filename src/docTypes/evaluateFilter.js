const check = require('check-types')
const {
  JsonotronUnrecognisedFilterNameError,
  JsonotronFilterFailedError
} = require('jsonotron-errors')

/**
 * Evaluate a doc type filter.
 * @param {String} docType A doc type.
 * @param {String} filterName The name of a filter.
 * @param {Object} filterParams A parameter object to be passed to the filter.
 */
const evaluateFilter = (docType, filterName, filterParams) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.string(filterName)
  check.assert.maybe.object(filterParams)

  const filter = (docType.filters || {})[filterName]

  if (!filter) {
    throw new JsonotronUnrecognisedFilterNameError(docType.name, filterName)
  }

  try {
    return filter.implementation(filterParams || {})
  } catch (err) {
    throw new JsonotronFilterFailedError(docType.name, filterName, err)
  }
}

module.exports = evaluateFilter

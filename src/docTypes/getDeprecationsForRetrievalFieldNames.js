const check = require('check-types')

/**
 * Returns an object where each key represents a deprecated field.
 * The value of each key is an object with a reason property that describes
 * why the field was deprecated and/or which field to use instead.
 * @param {Object} docType A document type.
 * @param {Array} retrievalFieldNames An array of field names.
 */
const getDeprecationsForRetrievalFieldNames = (docType, retrievalFieldNames) => {
  check.assert.object(docType)
  check.assert.object(docType.fields)
  check.assert.array.of.string(retrievalFieldNames)

  const deprecations = {}

  for (let i = 0; i < retrievalFieldNames.length; i++) {
    const retrievalFieldName = retrievalFieldNames[i]

    // field will be undefined for system field names
    const field = docType.fields[retrievalFieldName]

    if (field && field.deprecation) {
      deprecations[retrievalFieldName] = { reason: docType.fields[retrievalFieldName].deprecation }
    }
  }

  return deprecations
}

module.exports = getDeprecationsForRetrievalFieldNames

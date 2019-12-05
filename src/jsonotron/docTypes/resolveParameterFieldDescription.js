const check = require('check-types')

/**
 * Returns the description of the given parameter either by returning the description
 * property directly or by looking up the description of the referenced field on the doc type.
 * @param {Object} docType A doc type.
 * @param {String} parameterName The name of a filter, constructor or operation parameter.
 * @param {Object} parameter The definition of a filter, constructor or opration parameter.
 */
const resolveParameterFieldDescription = (docType, parameterName, parameter) => {
  check.assert.object(docType)
  check.assert.object(docType.fields)
  check.assert.string(parameterName)
  check.assert.object(parameter)

  if (parameter.lookup === 'field') {
    return parameter.description || docType.fields[parameterName].description
  } else {
    return parameter.description
  }
}

module.exports = resolveParameterFieldDescription

const check = require('check-types')

/**
 * Returns the true if the parameter is an array by either looking directly at the
 * parameter definition or by looking up the referenced field on the doc type.
 * @param {Object} docType A doc type.
 * @param {String} parameterName The name of a filter, constructor or operation parameter.
 * @param {Object} parameter The definition of a filter, constructor or opration parameter.
 */
const resolveParameterFieldIsArray = (docType, parameterName, parameter) => {
  check.assert.object(docType)
  check.assert.object(docType.fields)
  check.assert.string(parameterName)
  check.assert.object(parameter)

  if (parameter.lookup === 'field') {
    return docType.fields[parameterName].isArray
  } else {
    return parameter.isArray
  }
}

module.exports = resolveParameterFieldIsArray

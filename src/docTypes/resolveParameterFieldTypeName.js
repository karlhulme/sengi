const check = require('check-types')
const getFieldTypeNameForDocTypeField = require('./getFieldTypeNameForDocTypeField')

/**
 * Returns the field type of the given parameter either by returning the type
 * property directly or by looking up the type of the referenced field on the doc type.
 * @param {Object} docType A doc type.
 * @param {String} parameterName The name of a filter, constructor or operation parameter.
 * @param {Object} parameter The definition of a filter, constructor or opration parameter.
 */
const resolveParameterFieldTypeName = (docType, parameterName, parameter) => {
  check.assert.object(docType)
  check.assert.string(parameterName)
  check.assert.object(parameter)

  if (parameter.lookup === 'field') {
    return getFieldTypeNameForDocTypeField(docType.fields[parameterName])
  } else {
    return parameter.type
  }
}

module.exports = resolveParameterFieldTypeName

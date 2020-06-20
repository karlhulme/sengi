const { JsonotronInternalError } = require('jsonotron-errors')

/**
 * Returns the name of the field type for the given field.
 * @param {Object} field A field object from a doc type.
 */
const getFieldTypeNameForDocTypeField = field => {
  if (typeof field.type === 'string') {
    return field.type
  } else if (typeof field.ref === 'string') {
    return 'sysId'
  } else {
    throw new JsonotronInternalError('Field does not specify a type or a reference.')
  }
}

module.exports = getFieldTypeNameForDocTypeField

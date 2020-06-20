const check = require('check-types')
const {
  JsonotronCalculatedFieldFailedError,
  JsonotronUnrecognisedCalculatedFieldNameError
} = require('jsonotron-errors')

/**
 * Executes the calculated field value function using the inputs taken
 * from the given document and returns the result.
 * @param {Object} docType A document type.
 * @param {Object} doc A document.
 * @param {String} calculatedFieldName The name of a calculated field.
 */
const executeCalculatedField = (docType, doc, calculatedFieldName) => {
  check.assert.object(docType)
  check.assert.object(doc)
  check.assert.string(calculatedFieldName)

  const docTypeCalculatedField = docType.calculatedFields[calculatedFieldName]

  if (typeof docTypeCalculatedField !== 'object') {
    throw new JsonotronUnrecognisedCalculatedFieldNameError(docType.name, calculatedFieldName)
  }

  const input = {}

  if (Array.isArray(docTypeCalculatedField.inputFields)) {
    for (const inputFieldName of docTypeCalculatedField.inputFields) {
      input[inputFieldName] = doc[inputFieldName]
    }
  }

  try {
    return docTypeCalculatedField.value(input)
  } catch (err) {
    throw new JsonotronCalculatedFieldFailedError(docType.name, calculatedFieldName, err)
  }
}

module.exports = executeCalculatedField

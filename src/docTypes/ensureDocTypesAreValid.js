const check = require('check-types')
const { docTypeSchema } = require('../schemas')
const { JsonotronDocTypeValidationError } = require('../errors')
const getSystemFields = require('./getSystemFields')

/**
 * Raises an error if the given doc type does not conform
 * to the docTypeSchema.
 * @param {Object} ajv A JSON schema validator.
 * @param {Object} docType A doc type.
 */
const ensureDocTypeAgainstDocTypeSchema = (ajv, docType) => {
  check.assert.string(docType.name)

  const docTypeSchemaValidator = ajv.compile(docTypeSchema)

  if (!docTypeSchemaValidator(docType)) {
    throw new JsonotronDocTypeValidationError(docType.name,
      `Unable to validate against docTypeSchema.\n${JSON.stringify(docTypeSchemaValidator.errors, null, 2)}`)
  }
}

/**
 * Returns an array containing all the declared field names
 * and system field names.  This is the complete list of fields
 * that can be retrieved from the database.
 * @param {Object} docType A doc type.
 */
const getSystemAndDeclaredFields = docType => {
  check.assert.object(docType.fields)

  return getSystemFields().concat(Object.keys(docType.fields))
}

/**
 * Raises an error if any of the declared fields use
 * a reserved system name.
 * @param {Object} docType A doc type.
 */
const ensureDeclaredFieldNamesDontClashWithSystemFieldNames = docType => {
  check.assert.string(docType.name)
  check.assert.object(docType.fields)

  for (const fieldName in docType.fields) {
    if (getSystemFields().includes(fieldName)) {
      throw new JsonotronDocTypeValidationError(docType.name,
        `Field name '${fieldName}' cannot clash with a reserved system field name.`)
    }
  }
}

/**
 * Raises an error if any of the declared fields are
 * marked as required and also supply a default value.
 * @param {Object} docType A doc type.
 */
const ensureDeclaredFieldsWithDefaultValuesAreNotMarkedAsRequired = docType => {
  check.assert.string(docType.name)
  check.assert.object(docType.fields)

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]
    if (field.isRequired && typeof field.default !== 'undefined') {
      throw new JsonotronDocTypeValidationError(docType.name,
        `Field '${fieldName}' cannot be marked as required and supply a default value.`)
    }
  }
}

/**
 * Raises an error if any of the calculated fields reference
 * a field that is not declared on the doc type.
 * @param {Object} docType A doc type.
 */
const ensureCalculatedFieldInputsAreValid = docType => {
  check.assert.string(docType.name)

  const systemAndDeclaredFieldNames = getSystemAndDeclaredFields(docType)

  if (typeof docType.calculatedFields === 'object') {
    for (const calculatedFieldName in docType.calculatedFields) {
      const calculatedField = docType.calculatedFields[calculatedFieldName]

      for (const inputFieldName of calculatedField.inputFields) {
        if (!systemAndDeclaredFieldNames.includes(inputFieldName)) {
          throw new JsonotronDocTypeValidationError(docType.name,
            `Calculated field '${calculatedFieldName}' requires unrecognised input field '${inputFieldName}'.`)
        }
      }
    }
  }
}

/**
 * Raises an error if any of the constructor parameters
 * that are designated as a lookup are not declared on the doc type.
 * @param {Object} docType A doc type.
 */
const ensureConstructorInputsAreValid = docType => {
  check.assert.string(docType.name)

  const systemAndDeclaredFieldNames = getSystemAndDeclaredFields(docType)

  if (typeof docType.ctor === 'object' && typeof docType.ctor.parameters === 'object') {
    for (const ctorParameterName in docType.ctor.parameters) {
      const ctorParameter = docType.ctor.parameters[ctorParameterName]

      if (ctorParameter.lookup) {
        if (!systemAndDeclaredFieldNames.includes(ctorParameterName)) {
          throw new JsonotronDocTypeValidationError(docType.name,
            `Constructor parameter '${ctorParameterName}' is a lookup field but a matching declared field is missing.`)
        }
      }
    }
  }
}

/**
 * Raises an error if any of the operation parameters
 * (across all the defined operations)
 * that are designated as a lookup are not declared on the doc type.
 * @param {Object} docType A doc type.
 */
const ensureOperationInputsAreValid = docType => {
  check.assert.string(docType.name)

  const systemAndDeclaredFieldNames = getSystemAndDeclaredFields(docType)

  if (docType.operations) {
    for (const operationName in docType.operations) {
      const operation = docType.operations[operationName]

      for (const operationParameterName in operation.parameters) {
        const operationParameter = operation.parameters[operationParameterName]

        if (operationParameter.lookup) {
          if (!systemAndDeclaredFieldNames.includes(operationParameterName)) {
            throw new JsonotronDocTypeValidationError(docType.name,
              `Operation '${operationName}' states parameter '${operationParameterName}' is a lookup field but a matching declared field is missing.`)
          }
        }
      }
    }
  }
}

/**
 * Raises an error if the given doc type is not valid.
 * @param {Object} ajv A JSON schema validator.
 * @param {Object} docType A doc type.
 * @param {Array} fieldTypes An array of field types.
 */
const ensureDocTypeIsValid = (ajv, docType, fieldTypes) => {
  ensureDocTypeAgainstDocTypeSchema(ajv, docType)
  ensureDeclaredFieldNamesDontClashWithSystemFieldNames(docType)
  ensureCalculatedFieldInputsAreValid(docType)
  ensureConstructorInputsAreValid(docType)
  ensureOperationInputsAreValid(docType)
  ensureDeclaredFieldsWithDefaultValuesAreNotMarkedAsRequired(docType)
}

/**
 * Raises an error if any of the given doc types are not valid.
 * @param {Object} ajv A JSON schema validator.
 * @param {Array} docTypes An array of doc types.
 * @param {Array} fieldTypes An array of field types.
 */
const ensureDocTypesAreValid = (ajv, docTypes, fieldTypes) => {
  check.assert.object(ajv)
  check.assert.array.of.object(docTypes)
  check.assert.array.of.object(fieldTypes)

  for (let i = 0; i < docTypes.length; i++) {
    ensureDocTypeIsValid(ajv, docTypes[i], fieldTypes)
  }
}

module.exports = ensureDocTypesAreValid

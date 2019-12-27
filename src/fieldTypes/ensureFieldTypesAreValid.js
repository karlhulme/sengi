const check = require('check-types')
const { JsonotronFieldTypeValidationError } = require('../errors')
const { fieldTypeSchema } = require('../schemas')
const createJsonSchemaForFieldType = require('./createJsonSchemaForFieldType')

/**
 * Raises an error if the field type fails to conform to the fieldTypeSchema.
 * @param {Object} ajv A JSON schema validator.
 * @param {String} fieldType A field type.
 */
const ensureFieldTypeAgainstFieldTypeSchema = (ajv, fieldType) => {
  check.assert.string(fieldType.name)

  const fieldTypeSchemaValidator = ajv.compile(fieldTypeSchema)

  if (!fieldTypeSchemaValidator(fieldType)) {
    throw new JsonotronFieldTypeValidationError(fieldType.name,
      `Unable to validate against fieldTypeSchema.\n${JSON.stringify(fieldTypeSchemaValidator.errors, null, 2)}`)
  }
}

/**
 * Returns a validator function for the given field type.  The validator
 * function is created (compiled) by the given Ajv function by resolving
 * any required field types.  If the JSON is invalid it will fail to
 * compile and an error will be raised.
 * @param {Object} ajv A JSON schema validator.
 * @param {Array} fieldTypes An array of field types.
 * @param {Object} fieldType A field type.
 */
const createFieldTypeValueValidator = (ajv, fieldTypes, fieldType) => {
  check.assert.string(fieldType.name)

  try {
    const fieldValueSchema = createJsonSchemaForFieldType(fieldTypes, fieldType.name)
    return ajv.compile(fieldValueSchema)
  } catch (err) {
    throw new JsonotronFieldTypeValidationError(fieldType.name,
      `Unable to create field value validator for '${fieldType.name}'.\n${err.toString()}`)
  }
}

/**
 * Raises an error if any of the given example values are
 * found to be invalid.
 * @param {String} fieldTypeName The name of a field type.
 * @param {Function} validator A validator function that accepts a single parameter
 * and returns a boolean that indicates if the parameter was valid.  If the function
 * returns false it should also store the reason on an errors property.
 * @param {Array} exampleValues An array of values.
 */
const ensureExampleValuesAreValid = (fieldTypeName, validator, exampleValues) => {
  for (let i = 0; i < exampleValues.length; i++) {
    if (!validator(exampleValues[i])) {
      throw new JsonotronFieldTypeValidationError(fieldTypeName,
        `Example value '${JSON.stringify(exampleValues[i])}' does not validate with the schema.\n` +
        JSON.stringify(validator.errors, null, 2))
    }
  }
}

/**
 * Raises an error if any of the given invalid example values are
 * found to be valid.
 * @param {String} fieldTypeName The name of a field type.
 * @param {Function} validator A validator function that accepts a single parameter
 * and returns a boolean that indicates if the parameter was valid.  If the function
 * returns false it should also store the reason on an errors property.
 * @param {Array} invalidExampleValues An array of values.
 */
const ensureInvalidExampleValuesAreInvalid = (fieldTypeName, validator, invalidExampleValues) => {
  for (let i = 0; i < invalidExampleValues.length; i++) {
    if (validator(invalidExampleValues[i])) {
      throw new JsonotronFieldTypeValidationError(fieldTypeName,
        `Example invalid value '${JSON.stringify(invalidExampleValues[i])}' does (but should not) validate.\n` +
        JSON.stringify(validator.errors, null, 2))
    }
  }
}

/**
 * Raises an error if the given field type is not valid.
 * @param {Object} ajv A JSON schema validator.
 * @param {Array} fieldTypes An array of field types.
 * @param {Object} fieldType A field type to check for validatity.
 */
const ensureFieldTypeIsValid = (ajv, fieldTypes, fieldType) => {
  check.assert.string(fieldType.name)

  ensureFieldTypeAgainstFieldTypeSchema(ajv, fieldType)

  const fieldTypeValueValidator = createFieldTypeValueValidator(ajv, fieldTypes, fieldType)

  if (Array.isArray(fieldType.examples)) {
    ensureExampleValuesAreValid(fieldType.name, fieldTypeValueValidator, fieldType.examples)
  }

  if (Array.isArray(fieldType.invalidExamples)) {
    ensureInvalidExampleValuesAreInvalid(fieldType.name, fieldTypeValueValidator, fieldType.invalidExamples)
  }
}

/**
 * Raises an error if any of the given field types are not valid.
 * A valid field type will conform to the fieldTypeSchema,
 * declare a compilable JSON Schema (or be an enum), and
 * declare correct example and invalid example values.
 * @param {Object} ajv A json validator.
 * @param {Array} fieldTypes An array of field types.
 */
const ensureFieldTypesAreValid = (ajv, fieldTypes) => {
  check.assert.object(ajv)
  check.assert.array.of.object(fieldTypes)

  for (let i = 0; i < fieldTypes.length; i++) {
    ensureFieldTypeIsValid(ajv, fieldTypes, fieldTypes[i])
  }
}

module.exports = ensureFieldTypesAreValid
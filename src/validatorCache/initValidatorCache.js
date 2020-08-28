const check = require('check-types')
const {
  createJsonSchemaForDocTypeConstructorParameters,
  createJsonSchemaForDocTypeFilterParameters,
  createJsonSchemaForDocTypeInstance,
  createJsonSchemaForDocTypeMergePatch,
  createJsonSchemaForDocTypeOperationParameters
} = require('jsonotron-validation')
const ValidatorCache = require('./ValidatorCache')

/**
 * Initialises a validator cache with functions for checking the
 * fields, filter parameters, constructor parameters and operation
 * parameters for all the given document types.
 * @param {Object} ajv A json validator.
 * @param {Array} docTypes An array of document types.
 * @param {Array} fieldTypes An array of field types.
 * @param {Array} enumTypes An array of enum types.
 */
const initValidatorCache = (ajv, docTypes, fieldTypes, enumTypes) => {
  const validatorCache = new ValidatorCache()

  for (const docType of docTypes) {
    check.assert.string(docType.name)

    // instance
    const docSchema = createJsonSchemaForDocTypeInstance(docType, fieldTypes, enumTypes, true)
    const fieldsValidator = ajv.compile(docSchema)
    validatorCache.addDocTypeInstanceValidator(docType.name, fieldsValidator)

    // constructors
    const constructorSchema = createJsonSchemaForDocTypeConstructorParameters(docType, fieldTypes, enumTypes)
    const constructorValidator = ajv.compile(constructorSchema)
    validatorCache.addDocTypeConstructorParamsValidator(docType.name, constructorValidator)

    // filters
    for (const filterName in docType.filters) {
      const filterSchema = createJsonSchemaForDocTypeFilterParameters(docType, filterName, fieldTypes, enumTypes)
      const filterValidator = ajv.compile(filterSchema)
      validatorCache.addDocTypeFilterParamsValidator(docType.name, filterName, filterValidator)
    }

    // operations
    for (const operationName in docType.operations) {
      const operationSchema = createJsonSchemaForDocTypeOperationParameters(docType, operationName, fieldTypes, enumTypes)
      const operationValidator = ajv.compile(operationSchema)
      validatorCache.addDocTypeOperationParamsValidator(docType.name, operationName, operationValidator)
    }

    // updates
    const updateSchema = createJsonSchemaForDocTypeMergePatch(docType, fieldTypes, enumTypes)
    const updateValidator = ajv.compile(updateSchema)
    validatorCache.addDocTypeMergePatchValidator(docType.name, updateValidator)
  }

  return validatorCache
}

module.exports = initValidatorCache

const check = require('check-types')
const {
  createJsonSchemaForDocTypeFields,
  createJsonSchemaForDocTypeFunctionParameters,
  createJsonSchemaForDocTypeMergePatch,
  getConstructorParameters,
  getFilterNames,
  getFilterParameters,
  getOperationNames,
  getOperationParameters
} = require('../docTypes')
const ValidatorCache = require('./validatorCache')

/**
 * Initialises a validator cache with functions for checking the
 * fields, filter parameters, constructor parameters and operation
 * parameters for all the given document types.
 * @param {Object} ajv A json validator.
 * @param {Array} docTypes An array of document types.
 * @param {Array} fieldTypes An array of field types.
 */
const initValidatorCache = (ajv, docTypes, fieldTypes) => {
  const validatorCache = new ValidatorCache()

  for (const docType of docTypes) {
    check.assert.string(docType.name)

    // fields
    const fieldsSchema = createJsonSchemaForDocTypeFields(docType, fieldTypes)
    const fieldsValidator = ajv.compile(fieldsSchema)
    validatorCache.addDocTypeFieldsValidator(docType.name, fieldsValidator)

    // constructors
    const constructorParameters = getConstructorParameters(docType)
    const constructorSchema = createJsonSchemaForDocTypeFunctionParameters(docType, 'Constructor', constructorParameters, fieldTypes)
    const constructorValidator = ajv.compile(constructorSchema)
    validatorCache.addDocTypeConstructorParamsValidator(docType.name, constructorValidator)

    // filters
    for (const filterName of getFilterNames(docType)) {
      const filterParameters = getFilterParameters(docType, filterName)
      const filterSchema = createJsonSchemaForDocTypeFunctionParameters(docType, 'Filter ' + filterName, filterParameters, fieldTypes)
      const filterValidator = ajv.compile(filterSchema)
      validatorCache.addDocTypeFilterParamsValidator(docType.name, filterName, filterValidator)
    }

    // operations
    for (const operationName of getOperationNames(docType)) {
      const operationParameters = getOperationParameters(docType, operationName)
      const operationSchema = createJsonSchemaForDocTypeFunctionParameters(docType, 'Operation ' + operationName, operationParameters, fieldTypes)
      const operationValidator = ajv.compile(operationSchema)
      validatorCache.addDocTypeOperationParamsValidator(docType.name, operationName, operationValidator)
    }

    // updates
    const updateSchema = createJsonSchemaForDocTypeMergePatch(docType, fieldTypes)
    const updateValidator = ajv.compile(updateSchema)
    validatorCache.addDocTypeMergePatchValidator(docType.name, updateValidator)
  }

  return validatorCache
}

module.exports = initValidatorCache

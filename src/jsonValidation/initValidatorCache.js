const check = require('check-types')
const {
  createJsonSchemaForDocTypeConstructorParameters,
  createJsonSchemaForDocTypeFilterParameters,
  createJsonSchemaForDocTypeInstance,
  createJsonSchemaForDocTypeMergePatch,
  createJsonSchemaForDocTypeOperationParameters,
  getFilterNames,
  getOperationNames
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
    const docSchema = createJsonSchemaForDocTypeInstance(docType, fieldTypes)
    const fieldsValidator = ajv.compile(docSchema)
    validatorCache.addDocTypeFieldsValidator(docType.name, fieldsValidator)

    // constructors
    const constructorSchema = createJsonSchemaForDocTypeConstructorParameters(docType, fieldTypes)
    const constructorValidator = ajv.compile(constructorSchema)
    validatorCache.addDocTypeConstructorParamsValidator(docType.name, constructorValidator)

    // filters
    for (const filterName of getFilterNames(docType)) {
      const filterSchema = createJsonSchemaForDocTypeFilterParameters(docType, filterName, fieldTypes)
      const filterValidator = ajv.compile(filterSchema)
      validatorCache.addDocTypeFilterParamsValidator(docType.name, filterName, filterValidator)
    }

    // operations
    for (const operationName of getOperationNames(docType)) {
      const operationSchema = createJsonSchemaForDocTypeOperationParameters(docType, operationName, fieldTypes)
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

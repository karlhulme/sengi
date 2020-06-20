const check = require('check-types')
const {
  JsonotronConstructorParamsValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronFieldValueValidationError,
  JsonotronFilterParamsValidationError,
  JsonotronInternalError,
  JsonotronMergePatchValidationError,
  JsonotronOperationParamsValidationError
} = require('jsonotron-errors')

/**
 * Provides functions for storing and retrieving validators.
 */
class ValidatorCache {
  constructor () {
    const validators = {}

    /**
     * Raises an error if the given parameter is not a function,
     * otherwise the function is returned.
     * @param {Function} func A validator function.
     */
    const ensureFunction = func => {
      if (typeof func === 'function') {
        return func
      } else {
        throw new JsonotronInternalError('Validator function not found.')
      }
    }

    /**
     * Functions below are used to generate validator keys for the cache.
     * They are parameterised to accept whatever values are needed to
     * make the cache key unique.
     */
    const buildFieldTypeValueValidatorKey = fieldTypeName => `fieldType.value.${fieldTypeName}`
    const buildDocTypeFieldsValidatorKey = docTypeName => `docType.fields.${docTypeName}`
    const buildDocTypeFilterParamsValidatorKey = (docTypeName, filterName) => `docType.filter.${docTypeName}.${filterName}`
    const buildDocTypeConstructorParamsValidatorKey = docTypeName => `docType.constructor.${docTypeName}`
    const buildDocTypeOperationParamsValidatorKey = (docTypeName, operationName) => `docType.operation.${docTypeName}.${operationName}`
    const buildDocTypeMergePatchValidatorKey = (docTypeName) => `docType.update.${docTypeName}`

    /********************************************************************
     *                                                                  *
     *     Functions below determine if a validator is in the cache.    *
     *                                                                  *
     *******************************************************************/

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} fieldTypeName The name of a field type.
     */
    this.fieldTypeValueValidatorExists = fieldTypeName => {
      check.assert.string(fieldTypeName)
      return typeof validators[buildFieldTypeValueValidatorKey(fieldTypeName)] === 'function'
    }

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} docTypeName The name of a doc type.
     */
    this.docTypeFieldsValidatorExists = docTypeName => {
      check.assert.string(docTypeName)
      return typeof validators[buildDocTypeFieldsValidatorKey(docTypeName)] === 'function'
    }

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} filterName The name of a filter.
     */
    this.docTypeFilterParamsValidatorExists = (docTypeName, filterName) => {
      check.assert.string(docTypeName)
      check.assert.string(filterName)
      return typeof validators[buildDocTypeFilterParamsValidatorKey(docTypeName, filterName)] === 'function'
    }

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} docTypeName The name of a doc type.
     */
    this.docTypeConstructorParamsValidatorExists = (docTypeName) => {
      check.assert.string(docTypeName)
      return typeof validators[buildDocTypeConstructorParamsValidatorKey(docTypeName)] === 'function'
    }

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} operationName The name of an operation.
     */
    this.docTypeOperationParamsValidatorExists = (docTypeName, operationName) => {
      check.assert.string(docTypeName)
      check.assert.string(operationName)
      return typeof validators[buildDocTypeOperationParamsValidatorKey(docTypeName, operationName)] === 'function'
    }

    /**
     * Returns true if a validator exists, otherwise false.
     * @param {String} docTypeName The name of a doc type.
     */
    this.docTypeMergePatchValidatorExists = (docTypeName) => {
      check.assert.string(docTypeName)
      return typeof validators[buildDocTypeMergePatchValidatorKey(docTypeName)] === 'function'
    }

    /********************************************************************
     *                                                                  *
     *          Functions below add a validator to the cache.           *
     *                                                                  *
     *******************************************************************/

    /**
     * Adds the given validator to the cache.
     * @param {String} fieldTypeName The name of a field type.
     * @param {Function} validator A validator function.
     */
    this.addFieldTypeValueValidator = (fieldTypeName, validator) => {
      check.assert.string(fieldTypeName)
      check.assert.function(validator)
      validators[buildFieldTypeValueValidatorKey(fieldTypeName)] = validator
    }

    /**
     * Adds the given validator to the cache.
     * @param {String} docTypeName The name of a doc type.
     * @param {Function} validator A validator function.
     */
    this.addDocTypeFieldsValidator = (docTypeName, validator) => {
      check.assert.string(docTypeName)
      check.assert.function(validator)
      validators[buildDocTypeFieldsValidatorKey(docTypeName)] = validator
    }

    /**
     * Adds the given validator to the cache.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} filterName The name of a filter.
     * @param {Function} validator A validator function.
     */
    this.addDocTypeFilterParamsValidator = (docTypeName, filterName, validator) => {
      check.assert.string(docTypeName)
      check.assert.string(filterName)
      check.assert.function(validator)
      validators[buildDocTypeFilterParamsValidatorKey(docTypeName, filterName)] = validator
    }

    /**
     * Adds the given validator to the cache.
     * @param {String} docTypeName The name of a doc type.
     * @param {Function} validator A validator function.
     */
    this.addDocTypeConstructorParamsValidator = (docTypeName, validator) => {
      check.assert.string(docTypeName)
      check.assert.function(validator)
      validators[buildDocTypeConstructorParamsValidatorKey(docTypeName)] = validator
    }

    /**
     * Adds the given validator to the cache.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} operationName The name of an operation.
     * @param {Function} validator A validator function.
     */
    this.addDocTypeOperationParamsValidator = (docTypeName, operationName, validator) => {
      check.assert.string(docTypeName)
      check.assert.string(operationName)
      check.assert.function(validator)
      validators[buildDocTypeOperationParamsValidatorKey(docTypeName, operationName)] = validator
    }

    /**
     * Adds the given validator to the cache.
     * @param {String} docTypeName The name of a doc type.
     * @param {Function} validator A validator function.
     */
    this.addDocTypeMergePatchValidator = (docTypeName, validator) => {
      check.assert.string(docTypeName)
      check.assert.function(validator)
      validators[buildDocTypeMergePatchValidatorKey(docTypeName)] = validator
    }

    /********************************************************************
     *                                                                  *
     *       Functions below retrieve a validator from the cache.       *
     *                                                                  *
     *******************************************************************/

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     */
    this.getFieldTypeValueValidator = fieldTypeName => {
      check.assert.string(fieldTypeName)
      return ensureFunction(validators[buildFieldTypeValueValidatorKey(fieldTypeName)])
    }

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     * @param {String} docTypeName The name of a doc type.
     */
    this.getDocTypeFieldsValidator = docTypeName => {
      check.assert.string(docTypeName)
      return ensureFunction(validators[buildDocTypeFieldsValidatorKey(docTypeName)])
    }

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} filterName The name of a filter.
     */
    this.getDocTypeFilterParamsValidator = (docTypeName, filterName) => {
      check.assert.string(docTypeName)
      check.assert.string(filterName)
      return ensureFunction(validators[buildDocTypeFilterParamsValidatorKey(docTypeName, filterName)])
    }

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     * @param {String} docTypeName The name of a doc type.
     */
    this.getDocTypeConstructorParamsValidator = docTypeName => {
      check.assert.string(docTypeName)
      return ensureFunction(validators[buildDocTypeConstructorParamsValidatorKey(docTypeName)])
    }

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} operationName The name of an operation.
     */
    this.getDocTypeOperationParamsValidator = (docTypeName, operationName) => {
      check.assert.string(docTypeName)
      check.assert.string(operationName)
      return ensureFunction(validators[buildDocTypeOperationParamsValidatorKey(docTypeName, operationName)])
    }

    /**
     * Returns a validator function from the cache.  If a
     * validator function is not found then an error is raised.
     * @param {String} docTypeName The name of a doc type.
     */
    this.getDocTypeMergePatchValidator = (docTypeName) => {
      check.assert.string(docTypeName)
      return ensureFunction(validators[buildDocTypeMergePatchValidatorKey(docTypeName)])
    }

    /********************************************************************
     *                                                                  *
     *       Functions below execute a validator from the cache.        *
     *                                                                  *
     *******************************************************************/

    /**
     * Raises an error if the given field value is not a valid
     * instance of the given field type name.
     */
    this.ensureFieldTypeValue = (fieldTypeName, fieldValue) => {
      check.assert.string(fieldTypeName)
      const validator = ensureFunction(validators[buildFieldTypeValueValidatorKey(fieldTypeName)])

      if (!validator(fieldValue)) {
        throw new JsonotronFieldValueValidationError(fieldTypeName, validator.errors)
      }
    }

    /**
     * Raises an error if the given fields object is not a valid
     * instance of the given doc type name.
     * @param {String} docTypeName The name of a doc type.
     */
    this.ensureDocTypeFields = (docTypeName, fields) => {
      check.assert.string(docTypeName)
      check.assert.object(fields)
      const validator = ensureFunction(validators[buildDocTypeFieldsValidatorKey(docTypeName)])

      if (!validator(fields)) {
        throw new JsonotronDocumentFieldsValidationError(docTypeName, validator.errors)
      }
    }

    /**
     * Raises an error if the given filter params object is not a valid
     * instance of the filter identified by the given doc type and filter name.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} filterName The name of a filter.
     * @param {Object} filterParams A set of filter parameters.
     */
    this.ensureDocTypeFilterParams = (docTypeName, filterName, filterParams) => {
      check.assert.string(docTypeName)
      check.assert.string(filterName)
      check.assert.object(filterParams)
      const validator = ensureFunction(validators[buildDocTypeFilterParamsValidatorKey(docTypeName, filterName)])

      if (!validator(filterParams)) {
        throw new JsonotronFilterParamsValidationError(docTypeName, filterName, validator.errors)
      }
    }

    /**
     * Raises an error if the given constructor params object is not a valid
     * instance of the constructor params required for the given doc type name.
     * @param {String} docTypeName The name of a doc type.
     * @param {Object} constructorParams A set of constructor parameters.
     */
    this.ensureDocTypeConstructorParams = (docTypeName, constructorParams) => {
      check.assert.string(docTypeName)
      check.assert.object(constructorParams)
      const validator = ensureFunction(validators[buildDocTypeConstructorParamsValidatorKey(docTypeName)])

      if (!validator(constructorParams)) {
        throw new JsonotronConstructorParamsValidationError(docTypeName, validator.errors)
      }
    }

    /**
     * Raises an error if the given operation params object is not a valid
     * instance of the operation identified by the given doc type and operation name.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} operationName The name of an operation.
     * @param {Object} operationParams A set of operation parameters.
     */
    this.ensureDocTypeOperationParams = (docTypeName, operationName, operationParams) => {
      check.assert.string(docTypeName)
      check.assert.string(operationName)
      check.assert.object(operationParams)
      const validator = ensureFunction(validators[buildDocTypeOperationParamsValidatorKey(docTypeName, operationName)])

      if (!validator(operationParams)) {
        throw new JsonotronOperationParamsValidationError(docTypeName, operationName, validator.errors)
      }
    }

    /**
     * Raises an error if the given update params object is not a valid
     * instance of the update params required for the given doc type name.
     * @param {String} docTypeName The name of a doc type.
     * @param {Object} mergePatch A merge patch object.
     */
    this.ensureDocTypeMergePatch = (docTypeName, mergePatch) => {
      check.assert.string(docTypeName)
      check.assert.object(mergePatch)
      const validator = ensureFunction(validators[buildDocTypeMergePatchValidatorKey(docTypeName)])

      if (!validator(mergePatch)) {
        throw new JsonotronMergePatchValidationError(docTypeName, validator.errors)
      }
    }
  }
}

module.exports = ValidatorCache

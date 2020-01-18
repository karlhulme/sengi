const builtinFieldTypes = require('./builtinFieldTypes')
const { wrapDocStore } = require('./docStore')
const { createCustomisedAjv, initValidatorCache } = require('./jsonValidation')
const { combineCustomAndBuiltInFieldTypes, ensureFieldTypesAreValid } = require('./fieldTypes')
const { ensureDocTypesAreValid } = require('./docTypes')
const { ensureRoleTypesAreValid } = require('./roleTypes')
const {
  createDocument: createDocumentInternal,
  deleteDocument: deleteDocumentInternal,
  operateOnDocument: operateOnDocumentInternal,
  patchDocument: patchDocumentInternal,
  queryDocuments: queryDocumentsInternal,
  queryDocumentsByIds: queryDocumentsByIdsInternal,
  queryDocumentsByFilter: queryDocumentsByFilterInternal,
  replaceDocument: replaceDocumentInternal
} = require('./entryPoints')

/**
 * Each key of this object is a validator for a parameter of an external request object.
// Each validator function accepts a value and returns either true of false to indicate if it's valid.
 */
const requestParameterValidators = {
  constructorParams: v => typeof v === 'object',
  doc: v => typeof v === 'object',
  docStoreOptions: v => typeof v === 'object' || typeof v === 'undefined',
  docTypeName: v => typeof v === 'string',
  fieldNames: v => Array.isArray(v),
  filterName: v => typeof v === 'string',
  filterParams: v => typeof v === 'object',
  id: v => typeof v === 'string',
  ids: v => Array.isArray(v),
  mergePatch: v => typeof v === 'object',
  operationId: v => typeof v === 'string',
  operationName: v => typeof v === 'string',
  operationParams: v => typeof v === 'object',
  reqVersion: v => typeof v === 'string' || typeof v === 'undefined',
  roleNames: v => Array.isArray(v)
}

/**
 * Raises an error if the given request object contains an unrecognised parameter
// or contains a parameter value that is not valid.
 * @param {Object} req An external request object.
 * @param  {...any} parameterNames An array of parameter names expected by a request.
 */
const validateRequestParameters = function (req, ...parameterNames) {
  if (typeof req !== 'object' || Array.isArray(req) || req === null) {
    throw new TypeError('Request parameter \'req\' must be an object.')
  }

  for (const parameterName of parameterNames) {
    const validator = requestParameterValidators[parameterName]

    if (!validator(req[parameterName])) {
      throw new TypeError(`Input parameter '${parameterName}' with value '${JSON.stringify(req[parameterName])}' is not valid.`)
    }
  }
}

/**
 * Create a new Jsonotron.
 * @param {Object} config A configuration object.
 * @param {Object} config.docStore A collection of functions for reading and writing JSON data.
 * @param {Array} config.docTypes An array of doc types.
 * @param {Array} config.roleTypes An array of role types.
 * @param {Array} [config.fieldTypes] An array of field types that will be combined with the
 * built-in field types.
 * @param {Function} [config.onFieldsQueried] A function that is invoked whenever
 * a query is executed.  The function will be passed an array of the fields
 * queried.  This may be useful for determining when deprecated fields are no longer
 * being used.
 */
const createJsonotron = config => {
  if (typeof config !== 'object' || Array.isArray(config) || config === null) {
    throw new TypeError('Constructor parameter \'config\' must be an object.')
  }

  if (typeof config.docStore !== 'object' || Array.isArray(config.docStore) || config.docStore === null) {
    throw new TypeError('Constructor parameter \'config.docStore\' must be an object.')
  }

  if (!Array.isArray(config.docTypes)) {
    throw new TypeError('Constructor parameter \'config.docTypes\' must be an array.')
  }

  if (!Array.isArray(config.roleTypes)) {
    throw new TypeError('Constructor parameter \'config.roleTypes\' must be an array.')
  }

  if (typeof config.fieldTypes !== 'undefined' && !Array.isArray(config.fieldTypes)) {
    throw new TypeError('Constructor parameter \'config.fieldTypes\' must be an array.')
  }

  if (typeof config.onFieldsQueried !== 'undefined' && typeof config.onFieldsQueried !== 'function') {
    throw new TypeError('Constructor parameter \'config.onFieldsQueried\' must be function.')
  }

  // wrap the doc store so methods are safe to call
  const safeDocStore = wrapDocStore(config.docStore)

  // create a customised json validator with the jsonotron keywords and formats
  const ajv = createCustomisedAjv()

  // build the field types array (custom and built-in) and ensure they're all valid
  const builtinAndCustomFieldTypes = combineCustomAndBuiltInFieldTypes(config.fieldTypes || [], builtinFieldTypes)
  ensureFieldTypesAreValid(ajv, builtinAndCustomFieldTypes)

  // ensure all the doc types are valid
  ensureDocTypesAreValid(ajv, config.docTypes, builtinAndCustomFieldTypes)

  // ensure all role types are valid
  ensureRoleTypesAreValid(ajv, config.roleTypes, config.docTypes)

  // create a validator cache
  const validatorCache = initValidatorCache(ajv, config.docTypes, builtinAndCustomFieldTypes)

  // create a function that builds an entry point parameter object by
  // combining the external request object with the internal data.
  const buildEntryPointParameterObject = req => {
    return {
      safeDocStore,
      docTypes: config.docTypes,
      fieldTypes: builtinAndCustomFieldTypes,
      roleTypes: config.roleTypes,
      validatorCache,
      onFieldsQueried: config.onFieldsQueried,
      ...req
    }
  }

  return {
    /**
     * Create a new document.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id to be assigned to the newly created document.
     * @param {Object} req.constructorParams The parameters to be passed to the doc type constructor.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    createDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'constructorParams', 'docStoreOptions')
      return createDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Delete the document with given id.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be deleted.
     * @param {String} req.id The id of the document to be deleted.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    deleteDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'docStoreOptions')
      return deleteDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Invoke an operation on a document.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id of a document.
     * @param {String} req.reqVersion The version of the existing document if the operation is to be accepted.
     * @param {String} req.operationId The id of this operation request.
     * @param {String} req.operationName The name of an operation defined for the doc type.
     * @param {Object} req.operationParams The parameters to be passed to the operation.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    operateOnDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'operationName', 'operationParams', 'docStoreOptions')
      return operateOnDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Patch a document.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id of the document to update.
     * @param {String} req.reqVersion The version of the existing document if the operation is to be accepted.
     * @param {String} req.operationId The id of this operation request.
     * @param {Object} req.mergePatch An object that provides new values for specified keys in the document.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    patchDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'mergePatch', 'docStoreOptions')
      return patchDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Queries for all of the documents of a given doc type.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Array} req.fieldNames The field names to include in the response for each queried document.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocuments: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'docStoreOptions')
      return queryDocumentsInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Queries for the documents of a given doc type that match a given named filter.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Array} req.fieldNames The field names to include in the response for each queried document.
     * @param {String} req.filterName The name of a filter defined on the doc type.
     * @param {Object} req.filterParams The parameters to be passed to the filter.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocumentsByFilter: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'filterName', 'filterParams', 'docStoreOptions')
      return queryDocumentsByFilterInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Queries for the documents of a given doc type that have the given ids.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Array} req.fieldNames The field names to include in the response for each queried document.
     * @param {Array} req.ids The ids of the documents to include in the response.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocumentsByIds: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'ids', 'docStoreOptions')
      return queryDocumentsByIdsInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Create a new document.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Object} req.doc The replacement document that must include all system fields (id, docType and docOps).
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    replaceDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'doc', 'reqVersion', 'docStoreOptions')
      return replaceDocumentInternal(buildEntryPointParameterObject(req))
    }
  }
}

module.exports = createJsonotron

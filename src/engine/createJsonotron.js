const moment = require('moment')
const { builtinFieldTypes } = require('jsonotron-fields')
const { wrapDocStore } = require('../docStore')
const { createCustomisedAjv, initValidatorCache } = require('../jsonValidation')
const {
  combineCustomAndBuiltInFieldTypes,
  createJsonSchemaForFieldType,
  ensureFieldTypesAreValid
} = require('../fieldTypes')
const {
  createJsonSchemaForDocTypeConstructorParameters: createJsonSchemaForDocTypeConstructorParametersInternal,
  createJsonSchemaForDocTypeFilterParameters: createJsonSchemaForDocTypeFilterParametersInternal,
  createJsonSchemaForDocTypeInstance: createJsonSchemaForDocTypeInstanceInternal,
  createJsonSchemaForDocTypeMergePatch: createJsonSchemaForDocTypeMergePatchInternal,
  createJsonSchemaForDocTypeOperationParameters: createJsonSchemaForDocTypeOperationParametersInternal,
  ensureDocTypesAreValid
} = require('../docTypes')
const { ensureRoleTypesAreValid } = require('../roleTypes')
const createDocumentInternal = require('./createDocument')
const deleteDocumentInternal = require('./deleteDocument')
const operateOnDocumentInternal = require('./operateOnDocument')
const patchDocumentInternal = require('./patchDocument')
const queryDocumentsInternal = require('./queryDocuments')
const queryDocumentsByIdsInternal = require('./queryDocumentsByIds')
const queryDocumentsByFilterInternal = require('./queryDocumentsByFilter')
const replaceDocumentInternal = require('./replaceDocument')

/**
 * Each key of this object is a validator for a parameter of an external request object.
// Each validator function accepts a value and returns either true of false to indicate if it's valid.
 */
const requestParameterValidators = {
  constructorParams: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  doc: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  docStoreOptions: v => (typeof v === 'object' && !Array.isArray(v)) || typeof v === 'undefined',
  docTypeName: v => typeof v === 'string',
  externalDefs: v => typeof v === 'string' || typeof v === 'undefined' || v === null,
  fieldNames: v => Array.isArray(v),
  fieldTypeName: v => typeof v === 'string',
  filterName: v => typeof v === 'string',
  filterParams: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  fragment: v => typeof v === 'boolean' || typeof v === 'undefined' || v === null,
  id: v => typeof v === 'string',
  ids: v => Array.isArray(v),
  limit: v => typeof v === 'number' || typeof v === 'undefined',
  mergePatch: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  offset: v => typeof v === 'number' || typeof v === 'undefined',
  operationId: v => typeof v === 'string',
  operationName: v => typeof v === 'string',
  operationParams: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  reqProps: v => (typeof v === 'object' && !Array.isArray(v)) || typeof v === 'undefined',
  reqVersion: v => typeof v === 'string' || typeof v === 'undefined',
  roleNames: v => Array.isArray(v),
  userIdentity: v => typeof v === 'string'
}

/**
 * Uses the moment library to create a string in the DateTime UTC format.
 */
const momentDateTimeFunc = () => {
  return moment().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
}

/**
 * Choose a function for producing date time UTC strings.  This will either
 * the given function (if supplied) or a function built around the moment library.
 * @param {Function} [dateTimeFunc] A function that returns a string
 * with the current date and time using the built-in date time UTC format.
 */
const chooseDateTimeFunction = dateTimeFunc => {
  if (typeof dateTimeFunc === 'function') {
    return dateTimeFunc
  } else {
    return momentDateTimeFunc
  }
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
 * Returns the document type with the given name.
 * If the given docTypeName is not found in the array then
 * an error is thrown.
 * @param {Array} docTypes An array of document types.
 * @param {String} docTypeName The name of a document type.
 */
const getDocType = (docTypes, docTypeName) => {
  const docType = docTypes.find(dt => dt.name === docTypeName)

  if (docType) {
    return docType
  } else {
    throw new Error(`Document type with name '${docTypeName}' was not found.`)
  }
}

/**
 * Returns the field type with the given name.
 * If the given fieldTypeName is not found in the array then
 * an error is thrown.
 * @param {Array} fieldTypes An array of field types.
 * @param {String} fieldTypeName The name of a field type.
 */
const getFieldType = (fieldTypes, fieldTypeName) => {
  const fieldType = fieldTypes.find(dt => dt.name === fieldTypeName)

  if (fieldType) {
    return fieldType
  } else {
    throw new Error(`Field type with name '${fieldTypeName}' was not found.`)
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
 * @param {Function} [config.dateTimeFunc] A function that returns a UTC date/time string in
 * sysDateTime format.
 * @param {Function} [config.onPreSaveDoc] A function that is invoked just before a document is saved.
 * The function is passed roleNames, reqProps, docType and doc properties.
 * If the document is being updated (rather than created or replaced) then a mergePatch property
 * will be also be passed to the function that describes the changes.
 * Any change made to the doc property will be reflected in the document that is sent to the
 * document store to be persisted.
 * @param {Function} [config.onQueryDocs] A function that is invoked when a query is executed,
 * passed an object with roleNames, reqProps, docType, fieldNames and retrievalFieldNames properties.
 * @param {Function} [config.onCreateDoc] A function that is invoked when a document is created,
 * passed an object with roleNames, reqProps, docType and doc properties.
 * @param {Function} [config.onUpdateDoc] A function that is invoked when a document is updated,
 * passed an object with roleNames, reqProps, docType and doc properties.
 * @param {Function} [config.onDeleteDoc] A function that is invoked when a document is deleted,
 * passed an object with roleNames, reqProps, docType and id properties.
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

  if (typeof config.dateTimeFunc !== 'undefined' && typeof config.dateTimeFunc !== 'function') {
    throw new TypeError('Constructor parameter \'config.dateTimeFunc\' must be a function.')
  }

  if (typeof config.onPreSaveDoc !== 'undefined' && typeof config.onPreSaveDoc !== 'function') {
    throw new TypeError('Constructor parameter \'config.onPreSaveDoc\' must be a function.')
  }

  if (typeof config.onQueryDocs !== 'undefined' && typeof config.onQueryDocs !== 'function') {
    throw new TypeError('Constructor parameter \'config.onQueryDocs\' must be a function.')
  }

  if (typeof config.onCreateDoc !== 'undefined' && typeof config.onCreateDoc !== 'function') {
    throw new TypeError('Constructor parameter \'config.onCreateDoc\' must be a function.')
  }

  if (typeof config.onUpdateDoc !== 'undefined' && typeof config.onUpdateDoc !== 'function') {
    throw new TypeError('Constructor parameter \'config.onUpdateDoc\' must be a function.')
  }

  if (typeof config.onDeleteDoc !== 'undefined' && typeof config.onDeleteDoc !== 'function') {
    throw new TypeError('Constructor parameter \'config.onDeleteDoc\' must be a function.')
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

  // choose a function for generating UTC date/time strings.
  const dateTimeFunc = chooseDateTimeFunction(config.dateTimeFunc)

  // create a function that builds an entry point parameter object by
  // combining the external request object with the internal data.
  const buildEntryPointParameterObject = req => {
    return {
      safeDocStore,
      docTypes: config.docTypes,
      fieldTypes: builtinAndCustomFieldTypes,
      roleTypes: config.roleTypes,
      validatorCache,
      reqDateTime: dateTimeFunc(),
      onPreSaveDoc: config.onPreSaveDoc,
      onQueryDocs: config.onQueryDocs,
      onCreateDoc: config.onCreateDoc,
      onUpdateDoc: config.onUpdateDoc,
      onDeleteDoc: config.onDeleteDoc,
      ...req
    }
  }

  return {
    /***********************************************
    *                                              *
    *                  Get Methods                 *
    *                                              *
    \***********************************************/

    /**
     * Returns an array of document type names.
     */
    getDocTypeNames: () => {
      return config.docTypes.map(docType => docType.name)
    },

    /**
     * Returns an array of field type names.
     */
    getFieldTypeNames: () => {
      return builtinAndCustomFieldTypes.map(fieldType => fieldType.name)
    },

    /**
     * Returns an array of role type names.
     */
    getRoleTypeNames: () => {
      return config.roleTypes.map(roleType => roleType.name)
    },

    /***********************************************
    *                                              *
    *            Async Document Methods            *
    *                                              *
    \***********************************************/

    /**
     * Create a new document.
     * @param {Object} req A request.
     * @param {String} req.userIdentity The identity of a user.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id to be assigned to the newly created document.
     * @param {Object} req.constructorParams The parameters to be passed to the doc type constructor.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    createDocument: async req => {
      validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'constructorParams', 'reqProps', 'docStoreOptions')
      return createDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Delete the document with given id.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be deleted.
     * @param {String} req.id The id of the document to be deleted.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    deleteDocument: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'reqProps', 'docStoreOptions')
      return deleteDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Invoke an operation on a document.
     * @param {Object} req A request.
     * @param {String} req.userIdentity The identity of a user.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id of a document.
     * @param {String} req.reqVersion The version of the existing document if the operation is to be accepted.
     * @param {String} req.operationId The id of this operation request.
     * @param {String} req.operationName The name of an operation defined for the doc type.
     * @param {Object} req.operationParams The parameters to be passed to the operation.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    operateOnDocument: async req => {
      validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'operationName', 'operationParams', 'reqProps', 'docStoreOptions')
      return operateOnDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Patch a document.
     * @param {Object} req A request.
     * @param {String} req.userIdentity The identity of a user.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {String} req.id The id of the document to update.
     * @param {String} req.reqVersion The version of the existing document if the operation is to be accepted.
     * @param {String} req.operationId The id of this operation request.
     * @param {Object} req.mergePatch An object that provides new values for specified keys in the document.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    patchDocument: async req => {
      validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'mergePatch', 'reqProps', 'docStoreOptions')
      return patchDocumentInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Queries for all of the documents of a given doc type.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Array} req.fieldNames The field names to include in the response for each queried document.
     * @param {Number} [req.limit] The maximum number of documents to return.
     * @param {Number} [req.offset] The number of documents to skip.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocuments: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'limit', 'offset', 'reqProps', 'docStoreOptions')
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
     * @param {Number} [req.limit] The maximum number of documents to return.
     * @param {Number} [req.offset] The number of documents to skip.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocumentsByFilter: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'filterName', 'filterParams', 'limit', 'offset', 'reqProps', 'docStoreOptions')
      return queryDocumentsByFilterInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Queries for the documents of a given doc type that have the given ids.
     * @param {Object} req A request.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Array} req.fieldNames The field names to include in the response for each queried document.
     * @param {Array} req.ids The ids of the documents to include in the response.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    queryDocumentsByIds: async req => {
      validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'ids', 'reqProps', 'docStoreOptions')
      return queryDocumentsByIdsInternal(buildEntryPointParameterObject(req))
    },

    /**
     * Create a new document.
     * @param {Object} req A request.
     * @param {String} req.userIdentity The identity of a user.
     * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
     * @param {String} req.docTypeName The name of the document type to be created.
     * @param {Object} req.doc The replacement document that must include the system fields id and docType.
     * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
     * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
     */
    replaceDocument: async req => {
      validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'doc', 'reqVersion', 'reqProps', 'docStoreOptions')
      return replaceDocumentInternal(buildEntryPointParameterObject(req))
    },

    /***********************************************
    *                                              *
    *                Schema Methods                *
    *                                              *
    \***********************************************/

    /**
     * Create a JSON schema for the constructor parameters of a document type.
     * @param {Object} req A request.
     * @param {String} req.docTypeName The name of a document type.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForDocTypeConstructorParameters: req => {
      validateRequestParameters(req, 'docTypeName', 'fragment', 'externalDefs')
      const docType = getDocType(config.docTypes, req.docTypeName)
      return createJsonSchemaForDocTypeConstructorParametersInternal(docType, builtinAndCustomFieldTypes, req.fragment, req.externalDefs)
    },

    /**
     * Create a JSON schema for the filter parameters of a document type filter.
     * @param {Object} req A request.
     * @param {String} req.docTypeName The name of a document type.
     * @param {String} req.filterName The name of a filter.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForDocTypeFilterParameters: req => {
      validateRequestParameters(req, 'docTypeName', 'filterName', 'fragment', 'externalDefs')
      const docType = getDocType(config.docTypes, req.docTypeName)
      return createJsonSchemaForDocTypeFilterParametersInternal(docType, req.filterName, builtinAndCustomFieldTypes, req.fragment, req.externalDefs)
    },

    /**
     * Create a JSON schema for a document type instance.
     * @param {Object} req A request.
     * @param {String} req.docTypeName The name of a document type.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForDocTypeInstance: req => {
      validateRequestParameters(req, 'docTypeName', 'fragment', 'externalDefs')
      const docType = getDocType(config.docTypes, req.docTypeName)
      return createJsonSchemaForDocTypeInstanceInternal(docType, builtinAndCustomFieldTypes, req.fragment, req.externalDefs)
    },

    /**
     * Create a JSON schema for a merge patch of a document type.
     * @param {Object} req A request.
     * @param {String} req.docTypeName The name of a document type.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForDocTypeMergePatch: req => {
      validateRequestParameters(req, 'docTypeName', 'fragment', 'externalDefs')
      const docType = getDocType(config.docTypes, req.docTypeName)
      return createJsonSchemaForDocTypeMergePatchInternal(docType, builtinAndCustomFieldTypes, req.fragment, req.externalDefs)
    },

    /**
     * Create a JSON schema for the operation parameters of a document type operation.
     * @param {Object} req A request.
     * @param {String} req.docTypeName The name of a document type.
     * @param {String} req.operationName The name of an operation.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForDocTypeOperationParameters: req => {
      validateRequestParameters(req, 'docTypeName', 'operationName', 'fragment', 'externalDefs')
      const docType = getDocType(config.docTypes, req.docTypeName)
      return createJsonSchemaForDocTypeOperationParametersInternal(docType, req.operationName, builtinAndCustomFieldTypes, req.fragment, req.externalDefs)
    },

    /**
     * Create a JSON schema for a field type.
     * @param {Object} req A request.
     * @param {String} req.fieldTypeName The name of a field type.
     * @param {Boolean} [req.fragment] True if the $schema property should be omitted from the result.
     * @param {String} [req.externalDefs] A path to external definitions.  If supplied, then
     * the definitions property will omitted from the result.
     */
    createJsonSchemaForFieldType: req => {
      validateRequestParameters(req, 'fieldTypeName', 'fragment', 'externalDefs')
      const fieldType = getFieldType(builtinAndCustomFieldTypes, req.fieldTypeName)
      return createJsonSchemaForFieldType(builtinAndCustomFieldTypes, fieldType.name, req.fragment, req.externalDefs)
    }
  }
}

module.exports = createJsonotron

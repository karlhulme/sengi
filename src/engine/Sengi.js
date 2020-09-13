import moment from 'moment'
import { SengiValidation } from 'sengi-validation'
import { wrapDocStore } from '../docStore'
import { createDocument as createDocumentInternal } from './createDocument'
import { deleteDocument as deleteDocumentInternal } from './deleteDocument'
import { operateOnDocument as operateOnDocumentInternal } from './operateOnDocument'
import { patchDocument as patchDocumentInternal } from './patchDocument'
import { queryDocuments as queryDocumentsInternal } from './queryDocuments'
import { queryDocumentsByIds as queryDocumentsByIdsInternal } from './queryDocumentsByIds'
import { queryDocumentsByFilter as queryDocumentsByFilterInternal } from './queryDocumentsByFilter'
import { replaceDocument as replaceDocumentInternal } from './replaceDocument'

/**
 * Each key of this object is a validator for a parameter of an external request object.
// Each validator function accepts a value and returns either true of false to indicate if it's valid.
 */
const requestParameterValidators = {
  constructorParams: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  doc: v => typeof v === 'object' && v !== null && !Array.isArray(v),
  docStoreOptions: v => (typeof v === 'object' && !Array.isArray(v)) || typeof v === 'undefined',
  docTypeName: v => typeof v === 'string',
  fieldNames: v => Array.isArray(v),
  filterName: v => typeof v === 'string',
  filterParams: v => typeof v === 'object' && v !== null && !Array.isArray(v),
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
 * Choose a function for producing date time UTC strings.  This will either be
 * the given function (if supplied) or a function built around the moment library.
 * This is useful for testing, as the date/time stamped onto operations can be
 * controlled.
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
 * Create a new Sengi.
 * @param {Object} config A configuration object.
 * @param {Object} config.docStore A collection of functions for reading and writing JSON data.
 * @param {Array} config.docTypes An array of doc types.
 * @param {Array} config.roleTypes An array of role types.
 * @param {Array} [config.enumTypes] An array of enum types that will be combined with the
 * core enum types.
 * @param {Array} [config.schemaTypes] An array of schema types that will be combined with the
 * core schema types.
 * @param {Array} [config.formatValidators] An array of format validators that will be combined with the
 * core format validators.
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
export class Sengi {
  constructor ({
    docStore, docTypes, roleTypes, enumTypes, schemaTypes, formatValidators, dateTimeFunc,
    onPreSaveDoc, onQueryDocs, onCreateDoc, onUpdateDoc, onDeleteDoc
  } = {}) {
    if (typeof docStore !== 'object' || Array.isArray(docStore) || docStore === null) {
      throw new TypeError('Constructor parameter \'config.docStore\' must be an object.')
    }

    if (!Array.isArray(docTypes)) {
      throw new TypeError('Constructor parameter \'config.docTypes\' must be an array.')
    }

    if (!Array.isArray(roleTypes)) {
      throw new TypeError('Constructor parameter \'config.roleTypes\' must be an array.')
    }

    if (typeof enumTypes !== 'undefined' && !Array.isArray(enumTypes)) {
      throw new TypeError('Constructor parameter \'config.enumTypes\' must be an array.')
    }

    if (typeof schemaTypes !== 'undefined' && !Array.isArray(schemaTypes)) {
      throw new TypeError('Constructor parameter \'config.schemaTypes\' must be an array.')
    }

    if (typeof formatValidators !== 'undefined' && !Array.isArray(formatValidators)) {
      throw new TypeError('Constructor parameter \'config.formatValidators\' must be an array.')
    }

    if (typeof dateTimeFunc !== 'undefined' && typeof dateTimeFunc !== 'function') {
      throw new TypeError('Constructor parameter \'config.dateTimeFunc\' must be a function.')
    }

    if (typeof onPreSaveDoc !== 'undefined' && typeof onPreSaveDoc !== 'function') {
      throw new TypeError('Constructor parameter \'config.onPreSaveDoc\' must be a function.')
    }

    if (typeof onQueryDocs !== 'undefined' && typeof onQueryDocs !== 'function') {
      throw new TypeError('Constructor parameter \'config.onQueryDocs\' must be a function.')
    }

    if (typeof onCreateDoc !== 'undefined' && typeof onCreateDoc !== 'function') {
      throw new TypeError('Constructor parameter \'config.onCreateDoc\' must be a function.')
    }

    if (typeof onUpdateDoc !== 'undefined' && typeof onUpdateDoc !== 'function') {
      throw new TypeError('Constructor parameter \'config.onUpdateDoc\' must be a function.')
    }

    if (typeof onDeleteDoc !== 'undefined' && typeof onDeleteDoc !== 'function') {
      throw new TypeError('Constructor parameter \'config.onDeleteDoc\' must be a function.')
    }

    // wrap the doc store so methods are safe to call
    const safeDocStore = wrapDocStore(docStore)

    // build the sengi validation
    this.sengiValidation = new SengiValidation({
      enumTypes,
      schemaTypes,
      formatValidators,
      roleTypes,
      docTypes
    })

    // extract the patched resources
    const patchedRoleTypes = this.sengiValidation.getPatchedRoleTypes()
    const patchedDocTypes = this.sengiValidation.getPatchedDocTypes()

    // choose a function for generating UTC date/time strings.
    const chosenDateTimeFunc = chooseDateTimeFunction(dateTimeFunc)

    // create a function that builds an entry point parameter object by
    // combining the external request object with the internal data.
    this.buildEntryPointParameterObject = req => {
      return {
        safeDocStore,
        sengiValidation: this.sengiValidation,
        roleTypes: patchedRoleTypes,
        docTypes: patchedDocTypes,
        reqDateTime: chosenDateTimeFunc(),
        onPreSaveDoc: onPreSaveDoc,
        onQueryDocs: onQueryDocs,
        onCreateDoc: onCreateDoc,
        onUpdateDoc: onUpdateDoc,
        onDeleteDoc: onDeleteDoc,
        ...req
      }
    }
  }

  /***********************************************
  *                                              *
  *                  Get Methods                 *
  *                                              *
  \***********************************************/

  /**
   * Clones and returns an array of enum types.
   */
  getPatchedEnumTypes () {
    return this.sengiValidation.getPatchedEnumTypes()
  }

  /**
   * Clones and returns an array of schema types.
   */
  getPatchedSchemaType () {
    return this.sengiValidation.getPatchedSchemaTypes()
  }

  /**
   * Clones and returns an array of role types.
   */
  getPatchedRoleTypes () {
    return this.sengiValidation.getPatchedRoleTypes()
  }

  /**
   * Clones and returns an array of document types.
   * After the cloning process, the functions are still intact.
   */
  getPatchedDocTypes () {
    return this.sengiValidation.getPatchedDocTypes()
  }

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
  async createDocument (req) {
    validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'constructorParams', 'reqProps', 'docStoreOptions')
    return createDocumentInternal(this.buildEntryPointParameterObject(req))
  }

  /**
   * Delete the document with given id.
   * @param {Object} req A request.
   * @param {Array} req.roleNames An array of role names, indicating the roles held by the account making the request.
   * @param {String} req.docTypeName The name of the document type to be deleted.
   * @param {String} req.id The id of the document to be deleted.
   * @param {Object} [req.reqProps] A property bag of request properties that is passed to the event handlers.
   * @param {Object} [req.docStoreOptions] A property bag of doc store options that is passed to the underlying document store.
   */
  async deleteDocument (req) {
    validateRequestParameters(req, 'roleNames', 'docTypeName', 'id', 'reqProps', 'docStoreOptions')
    return deleteDocumentInternal(this.buildEntryPointParameterObject(req))
  }

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
  async operateOnDocument (req) {
    validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'operationName', 'operationParams', 'reqProps', 'docStoreOptions')
    return operateOnDocumentInternal(this.buildEntryPointParameterObject(req))
  }

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
  async patchDocument (req) {
    validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'id', 'reqVersion', 'operationId', 'mergePatch', 'reqProps', 'docStoreOptions')
    return patchDocumentInternal(this.buildEntryPointParameterObject(req))
  }

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
  async queryDocuments (req) {
    validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'limit', 'offset', 'reqProps', 'docStoreOptions')
    return queryDocumentsInternal(this.buildEntryPointParameterObject(req))
  }

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
  async queryDocumentsByFilter (req) {
    validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'filterName', 'filterParams', 'limit', 'offset', 'reqProps', 'docStoreOptions')
    return queryDocumentsByFilterInternal(this.buildEntryPointParameterObject(req))
  }

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
  async queryDocumentsByIds (req) {
    validateRequestParameters(req, 'roleNames', 'docTypeName', 'fieldNames', 'ids', 'reqProps', 'docStoreOptions')
    return queryDocumentsByIdsInternal(this.buildEntryPointParameterObject(req))
  }

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
  async replaceDocument (req) {
    validateRequestParameters(req, 'userIdentity', 'roleNames', 'docTypeName', 'doc', 'reqVersion', 'reqProps', 'docStoreOptions')
    return replaceDocumentInternal(this.buildEntryPointParameterObject(req))
  }
}

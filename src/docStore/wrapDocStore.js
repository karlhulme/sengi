const check = require('check-types')
const ErrorCodes = require('./errorCodes')
const {
  JsonotronInternalError,
  JsonotronDocStoreFailureError,
  JsonotronDocStoreInvalidResponseError,
  JsonotronDocStoreMissingFunctionError,
  JsonotronDocStoreUnrecognisedErrorCodeError,
  JsonotronRequiredVersionNotAvailableError
} = require('../errors')

/**
 * Raises an appropriate error if the given doc store result
 * indicates there was a problem with processing a request.
 * @param {String} functionName The name of a doc store function.
 * @param {Object} result The return value from a doc store method.
 */
const ensureDocStoreResult = (functionName, result) => {
  check.assert.string(functionName)

  if (typeof result !== 'object' || Array.isArray(result) || result === null) {
    throw new JsonotronDocStoreInvalidResponseError(functionName, 'Response must be an object.')
  }

  if (result.errorCode === ErrorCodes.DOC_STORE_REQ_VERSION_NOT_AVAILABLE) {
    throw new JsonotronRequiredVersionNotAvailableError()
  } else if (typeof result.errorCode !== 'undefined') {
    throw new JsonotronDocStoreUnrecognisedErrorCodeError(functionName, result.errorCode)
  }
}

/**
 * Raises an error if the given docs property is not an array or
 * the types of the system fields are not valid.
 * @param {String} functionName The name of a function that was called.
 * @param {Array} docs An array of docs returned by the invoked function.
 * @param {String} docTypeName The expected doc type of the returned docs.
 */
const ensureReturnedDocsArray = (functionName, docs, docTypeName) => {
  if (!Array.isArray(docs)) {
    throw new JsonotronDocStoreInvalidResponseError(functionName, 'Property \'docs\' must be an array.')
  }

  for (const doc of docs) {
    if (typeof doc.id !== 'undefined' && typeof doc.id !== 'string') {
      throw new JsonotronDocStoreInvalidResponseError(functionName, 'When returned, doc property \'id\' must be a string.')
    }

    if (typeof doc.docType !== 'undefined' && doc.docType !== docTypeName) {
      throw new JsonotronDocStoreInvalidResponseError(functionName, `When returned, doc property 'docType' must match requested type '${docTypeName}'`)
    }

    if (typeof doc.docOps !== 'undefined' && !Array.isArray(doc.docOps)) {
      throw new JsonotronDocStoreInvalidResponseError(functionName, 'When returned, doc property \'docOps\' must be an array.')
    }

    if (typeof doc.docVersion !== 'undefined' && typeof doc.docVersion !== 'string') {
      throw new JsonotronDocStoreInvalidResponseError(functionName, 'When returned, doc property \'docVersion\' must be a string.')
    }
  }
}

/**
 * Executes the given function using the given doc store
 * and parameters and returns the result.  If the function
 * raises an error it is wrapped.
 * @param {String} functionName The name of a function.
 * @param {Function} func A doc store function to call.
 * @param {Object} docStore A document store.
 * @param {Array} params The parameters for the function.
 */
const safeInvokeDocStoreFunction = (functionName, func, docStore, params) => {
  check.assert.string(functionName)
  check.assert.function(func)
  check.assert.object(docStore)
  check.assert.array(params)

  try {
    return func.apply(docStore, params)
  } catch (err) {
    throw new JsonotronDocStoreFailureError(functionName, err)
  }
}

/**
 * Executes the requested function from the given doc store
 * but handles errors from missing functions or functions
 * raising errors by providing explanatory error messages.
 * @param {Object} docStore A document store.
 * @param {String} functionName The name of a function.
 * @param {Array} params The parameters for the function.
 */
const safeExecuteDocStoreFunction = async (docStore, functionName, params) => {
  check.assert.object(docStore)
  check.assert.string(functionName)
  check.assert.array(params)

  const func = docStore[functionName]

  if (typeof func !== 'function') {
    throw new JsonotronDocStoreMissingFunctionError(functionName)
  }

  const result = await safeInvokeDocStoreFunction(functionName, func, docStore, params)
  ensureDocStoreResult(functionName, result)

  return result
}

/**
 * Wraps a document store such that missing or mishaving functions
 * will cause useful explanatory errors to be raised.  This is then
 * considerd a safe document store.
 */
const wrapDocStore = (docStore) => {
  check.assert.object(docStore)

  return {
    /**
     * Delete a single document from the store using it's id.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} id The id of a document.
     * @param {Object} options A set of options supplied with the original request.
     */
    deleteById: async (docTypeName, id, options) => {
      check.assert.string(docTypeName)
      check.assert.string(id)
      check.assert.maybe.object(options)

      await safeExecuteDocStoreFunction(docStore, 'deleteById', [docTypeName, id, options])
    },

    /**
     * Returns true if a document with the given id
     * is in the datastore.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} id The id of a document.
     * @param {Object} options A set of options supplied with the original request.
     */
    exists: async (docTypeName, id, options) => {
      check.assert.string(docTypeName)
      check.assert.string(id)
      check.assert.maybe.object(options)

      const result = await safeExecuteDocStoreFunction(docStore, 'exists', [docTypeName, id, options])

      if (typeof result.found !== 'boolean') {
        throw new JsonotronDocStoreInvalidResponseError('exists', 'Property \'found\' must be a boolean.')
      }

      return result.found
    },

    /**
     * Fetch a single document using it's id.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} id The id of a document.
     * @param {Object} options A set of options supplied with the original request.
     */
    fetch: async (docTypeName, id, options) => {
      check.assert.string(docTypeName)
      check.assert.string(id)
      check.assert.maybe.object(options)

      const result = await safeExecuteDocStoreFunction(docStore, 'fetch', [docTypeName, id, options])

      if (typeof result.doc !== 'object' || Array.isArray(result.doc)) {
        throw new JsonotronDocStoreInvalidResponseError('fetch', 'Property \'doc\' must be an object.')
      }

      if (result.doc !== null) {
        if (typeof result.doc.id !== 'string') {
          throw new JsonotronDocStoreInvalidResponseError('fetch', 'Returned document must have an \'id\' string property.')
        }

        if (result.doc.id !== id) {
          throw new JsonotronDocStoreInvalidResponseError('fetch', 'Returned document must have the requested \'id\'.')
        }

        if (result.doc.docType !== docTypeName) {
          throw new JsonotronDocStoreInvalidResponseError('fetch', `Returned document must have a 'docType' property of the expected type '${docTypeName}'.`)
        }

        if (!Array.isArray(result.doc.docOps)) {
          throw new JsonotronDocStoreInvalidResponseError('fetch', 'Returned document must have a \'docOps\' array property.')
        }

        if (typeof result.doc.docVersion !== 'string') {
          throw new JsonotronDocStoreInvalidResponseError('fetch', 'Returned document must have a \'docVersion\' string property.')
        }
      }

      return result.doc
    },

    /**
     * Query for all documents of a specified type.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} fieldNames An array of field names to include in the response.
     * @param {Object} options A set of options supplied with the original request.
     */
    queryAll: async (docTypeName, fieldNames, options) => {
      check.assert.string(docTypeName)
      check.assert.array.of.string(fieldNames)
      check.assert.maybe.object(options)

      const result = await safeExecuteDocStoreFunction(docStore, 'queryAll', [docTypeName, fieldNames, options])
      ensureReturnedDocsArray('queryAll', result.docs, docTypeName)
      return result.docs
    },

    /**
     * Query for documents of a specified type that also match a filter.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} fieldNames An array of field names to include in the response.
     * @param {Any} filterExpression A filter expression that resulted from invoking the fitler
     * implementation on the doc type.
     * @param {Object} options A set of options supplied with the original request.
     */
    queryByFilter: async (docTypeName, fieldNames, filterExpression, options) => {
      check.assert.string(docTypeName)
      check.assert.assigned(filterExpression)
      check.assert.array.of.string(fieldNames)
      check.assert.maybe.object(options)

      const result = await safeExecuteDocStoreFunction(docStore, 'queryByFilter', [docTypeName, fieldNames, filterExpression, options])
      ensureReturnedDocsArray('queryByFilter', result.docs, docTypeName)
      return result.docs
    },

    /**
     * Query for documents of a specified type that also have one of the given ids.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} fieldNames An array of field names to include in the response.
     * @param {Any} ids An array of document ids.
     * @param {Object} options A set of options supplied with the original request.
     */
    queryByIds: async (docTypeName, fieldNames, ids, options) => {
      check.assert.string(docTypeName)
      check.assert.array.of.string(fieldNames)
      check.assert.array.of.string(ids)
      check.assert.maybe.object(options)

      const result = await safeExecuteDocStoreFunction(docStore, 'queryByIds', [docTypeName, fieldNames, ids, options])
      ensureReturnedDocsArray('queryByIds', result.docs, docTypeName)
      return result.docs
    },

    /**
     * Store a single document in the store, overwriting an existing one if necessary.
     * @param {String} docTypeName The name of a doc type.
     * @param {String} doc The document to store.
     * @param {String} reqVersion The document version required to complete the upsert
     * or null if any version is acceptable.
     * @param {Object} options A set of options supplied with the original request.
     */
    upsert: async (docTypeName, doc, reqVersion, options) => {
      check.assert.string(docTypeName)
      check.assert.object(doc)
      check.assert.maybe.string(reqVersion)
      check.assert.maybe.object(options)

      if (doc.docType !== docTypeName) {
        throw new JsonotronInternalError(`Cannot upsert document with docType property '${doc.docType}' that does not match docTypeName '${docTypeName}'.`)
      }

      await safeExecuteDocStoreFunction(docStore, 'upsert', [docTypeName, doc, reqVersion, options])
    }
  }
}

module.exports = wrapDocStore
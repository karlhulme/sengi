const check = require('check-types')

/**
 * Returns an object that combines the given request options with
 * the options defined for the doc store on the doc type.
 * @param {Object} docType A doc type.
 * @param {Object} requestOptions An object keyed with options provided in a request.
 */
const createDocStoreOptions = (docType, requestOptions) => {
  check.assert.object(docType)
  check.assert.maybe.object(docType.docStoreOptions)
  check.assert.maybe.object(requestOptions)

  return Object.assign({}, requestOptions, docType.docStoreOptions)
}

module.exports = createDocStoreOptions

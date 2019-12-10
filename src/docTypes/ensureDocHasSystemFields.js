const check = require('check-types')
const { JsonotronInternalError } = require('../errors')
const getSystemFields = require('./getSystemFields')

/**
 * Raises an error if the given document is missing any of the system fields.
 * @param {Object} doc A document.
 */
const ensureDocHasSystemFields = doc => {
  check.assert.object(doc)

  for (const systemFieldName of getSystemFields()) {
    if (!doc[systemFieldName]) {
      throw new JsonotronInternalError(`Document is missing system property '${systemFieldName}'`)
    }
  }
}

module.exports = ensureDocHasSystemFields

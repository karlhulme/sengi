const check = require('check-types')
const { JsonotronInvalidMergePatchError } = require('../errors')
const isSystemFieldName = require('./isSystemFieldName')

/**
 * Raises an error if the given patch references
 * any of the system fields.
 * @param {Object} patch A patch object.
 */
const ensureMergePatchAvoidsSystemFields = patch => {
  check.assert.object(patch)

  for (const patchKey in patch) {
    if (isSystemFieldName(patchKey)) {
      throw new JsonotronInvalidMergePatchError(`Cannot reference a system field '${patchKey}'.`)
    }
  }
}

module.exports = ensureMergePatchAvoidsSystemFields

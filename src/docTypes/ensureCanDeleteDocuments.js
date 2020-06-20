const check = require('check-types')
const { JsonotronActionForbiddenByPolicyError } = require('jsonotron-errors')

/**
 * Raises an error if the doc type policy does not allow documents to be deleted.
 * @param {Object} docType A doc type.
 */
const ensureCanDeleteDocuments = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canDeleteDocuments !== true) {
    throw new JsonotronActionForbiddenByPolicyError(docType.name, 'delete document')
  }
}

module.exports = ensureCanDeleteDocuments

const check = require('check-types')
const { JsonotronActionForbiddenByPolicyError } = require('jsonotron-errors')

/**
 * Raises an error if the doc type policy does not allow
 * the entire collection to be fetched in one go.
 * @param {Object} docType A doc type.
 */
const ensureCanFetchWholeCollection = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canFetchWholeCollection !== true) {
    throw new JsonotronActionForbiddenByPolicyError(docType.name, 'fetch whole collection')
  }
}

module.exports = ensureCanFetchWholeCollection

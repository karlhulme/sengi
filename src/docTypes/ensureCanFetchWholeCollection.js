import check from 'check-types'
import { SengiActionForbiddenByPolicyError } from '../errors'

/**
 * Raises an error if the doc type policy does not allow
 * the entire collection to be fetched in one go.
 * @param {Object} docType A doc type.
 */
export const ensureCanFetchWholeCollection = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canFetchWholeCollection !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'fetch whole collection')
  }
}

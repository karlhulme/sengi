import check from 'check-types'
import { SengiActionForbiddenByPolicyError } from '../errors'

/**
 * Raises an error if the doc type policy does not allow documents to be deleted.
 * @param {Object} docType A doc type.
 */
export const ensureCanDeleteDocuments = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canDeleteDocuments !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'delete document')
  }
}

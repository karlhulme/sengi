import check from 'check-types'
import { SengiActionForbiddenByPolicyError } from '../errors'

/**
 * Raises an error if the doc type policy does not allow
 * a document to be replaced.
 * @param {Object} docType A doc type.
 */
export const ensureCanReplaceDocuments = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canReplaceDocuments !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'replace document')
  }
}

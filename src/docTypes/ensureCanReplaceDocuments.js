import check from 'check-types'
import { JsonotronActionForbiddenByPolicyError } from '../jsonotron-errors'

/**
 * Raises an error if the doc type policy does not allow
 * a document to be replaced.
 * @param {Object} docType A doc type.
 */
export const ensureCanReplaceDocuments = docType => {
  check.assert.object(docType)
  check.assert.string(docType.name)

  if (typeof docType.policy !== 'object' || docType.policy.canReplaceDocuments !== true) {
    throw new JsonotronActionForbiddenByPolicyError(docType.name, 'replace document')
  }
}

import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'

/**
 * Raises an error if the doc type policy does not allow documents to be deleted.
 * @param docType A doc type.
 */
export function ensureCanDeleteDocuments (docType: DocType): void {
  if (typeof docType.policy !== 'object' || docType.policy.canDeleteDocuments !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'delete document')
  }
}

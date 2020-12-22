import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'

/**
 * Raises an error if the doc type policy does not allow
 * a document to be replaced.
 * @param docType A doc type.
 */
export function ensureCanReplaceDocuments (docType: DocType): void {
  if (typeof docType.policy !== 'object' || docType.policy.canReplaceDocuments !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'replace document')
  }
}

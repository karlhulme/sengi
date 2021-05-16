import { SengiActionForbiddenByPolicyError, AnyDocType } from 'sengi-interfaces'

/**
 * Raises an error if the doc type policy does not allow documents to be deleted.
 * @param docType A document type.
 */
export function ensureCanDeleteDocuments (docType: AnyDocType): void {
  if (docType.policy?.canDeleteDocuments !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'delete document')
  }
}

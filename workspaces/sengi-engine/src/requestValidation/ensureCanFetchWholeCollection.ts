import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'

/**
 * Raises an error if the doc type policy does not allow
 * the entire collection to be fetched in one go.
 * @param docType A doc type.
 */
export function ensureCanFetchWholeCollection (docType: DocType): void {
  if (typeof docType.policy !== 'object' || docType.policy.canFetchWholeCollection !== true) {
    throw new SengiActionForbiddenByPolicyError(docType.name, 'fetch whole collection')
  }
}

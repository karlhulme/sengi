import { AnyDocType, DocRecord } from 'sengi-interfaces'

const DEFAULT_MAX_OP_IDS = 5

/**
 * Append the latest operation id to the docOpIds array.
 * @param docType A document type.
 * @param doc A doc.
 * @param opId An operation id.
 */
export function appendDocOpId (docType: AnyDocType, doc: DocRecord, opId: string): void {
  if (!Array.isArray(doc.docOpIds)) {
    doc.docOpIds = []
  }

  while (doc.docOpIds.length >= (docType.policy?.maxOpIds || DEFAULT_MAX_OP_IDS)) {
    doc.docOpIds.splice(0, 1)
  }

  doc.docOpIds.push(opId)
}

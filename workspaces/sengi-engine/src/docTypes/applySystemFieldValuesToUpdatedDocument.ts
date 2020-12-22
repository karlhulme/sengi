import { Doc, DocOp, DocType } from 'sengi-interfaces'

/**
 * Update the docOps array with the latest operation.  Create the array if it
 * is not present.
 * @param docType The document type.
 * @param doc A doc.
 * @param opId An id of the operation that caused the update of the document.
 * @param style A value of either 'operation' or 'patch'.
 * @param operationName The name of an operation, if the style was 'operation'.
 */
export function applySystemFieldValuesToUpdatedDocument (docType: DocType, doc: Doc, opId: string, style: 'operation'|'patch', operationName?: string): void {
  if (!Array.isArray(doc.docOps)) {
    doc.docOps = []
  }

  while (doc.docOps.length >= docType.policy.maxOpsSize) {
    doc.docOps.splice(0, 1)
  }

  const op: DocOp = {
    opId,
    style
  }

  if (style === 'operation' && operationName) {
    op.operationName = operationName
  }

  doc.docOps.push(op)
}

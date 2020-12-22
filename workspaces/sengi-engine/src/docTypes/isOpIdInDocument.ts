import { Doc, DocOp } from 'sengi-interfaces'

/**
 * Returns true if the given operation id exists in
 * the array of processed operation ids on the given document.
 * @param doc A document.
 * @param opId The id of an operation.
 */
export function isOpIdInDocument (doc: Doc, opId: string): boolean {
  if (Array.isArray(doc.docOps)) {
    const docOps = doc.docOps as DocOp[]
    return docOps.findIndex(op => op.opId === opId) > -1
  } else {
    return false
  }
}

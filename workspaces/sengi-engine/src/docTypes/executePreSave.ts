import { SengiPreSaveFailedError, AnyDocType, DocRecord } from 'sengi-interfaces'

/**
 * Execute a doc type pre-save function.
 * @param docType A doc type.
 * @param doc A document that may be amended by the function.
 */
export function executePreSave (docType: AnyDocType, doc: DocRecord): void {
  if (typeof docType.preSave === 'function') {
    try {
      docType.preSave(doc)
    } catch (err) {
      throw new SengiPreSaveFailedError(docType.name, err)
    }
  }
}

import { DocType, Doc, SengiPreSaveFailedError } from 'sengi-interfaces'

/**
 * Execute a doc type pre-save function.
 * @param docType A doc type.
 * @param doc A document that may be amended by the function.
 */
export function executePreSave (docType: DocType, doc: Doc): void {
  if (typeof docType.preSave === 'function') {
    try {
      docType.preSave(doc)
    } catch (err) {
      throw new SengiPreSaveFailedError(docType.name, err)
    }
  }
}

import { DocRecord, SengiDocNotFoundError } from 'sengi-interfaces'

/**
 * Raises an error if the given doc is not an object, otherwise returns
 * the given document.
 * @param docTypeName A doc type name.
 * @param id The id of the document that was searched for.
 * @param doc The document object that was returned from a document store.
 */
export function ensureDocWasFound (docTypeName: string, id: string, doc: unknown): DocRecord {
  if (typeof doc !== 'object' || Array.isArray(doc) || doc === null) {
    throw new SengiDocNotFoundError(docTypeName, id)
  }

  return doc as DocRecord
}

import { Doc } from 'sengi-interfaces'

/**
 * Adds the system fields id, docType and the docHeader object to the given document.
 * @param docTypeName A doc type.
 * @param doc A doc.
 * @param id A new id that conforms to the uuid schema type.
 */
export function addSystemFieldValuesToNewDocument (doc: Doc, docTypeName: string, id: string): void {
  doc.id = id
  doc.docType = docTypeName
  doc.docOps = []
}

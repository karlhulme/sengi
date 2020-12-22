import { DocType, Doc } from 'sengi-interfaces'
import { executeCalculatedField } from './executeCalculatedField'

/**
 * Update the calculated fields on the given document.
 * @param docType A document type.
 * @param doc A doc.
 */
export function updateCalcsOnDocument (docType: DocType, doc: Doc): void {
  for (const calculatedFieldName in docType.calculatedFields) {
    doc[calculatedFieldName] = executeCalculatedField(docType, doc, calculatedFieldName)
  }
}

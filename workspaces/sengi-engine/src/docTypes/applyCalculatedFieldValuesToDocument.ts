import { DocType, Doc } from 'sengi-interfaces'
import { executeCalculatedField } from './executeCalculatedField'

/**
 * Applies calculated field values to the given doc, as defined on the given
 * doc type, for the fields that are required.  This function assumes that
 * any necessary inputs for the calculated field wlll already by present
 * on the given doc.
 * @param docType A doc type.
 * @param doc A document.
 * @param requiredFieldNames An array of field names.
 */
export function applyCalculatedFieldValuesToDocument (docType: DocType, doc: Doc, requiredFieldNames: string[]): void {
  for (const fieldName of requiredFieldNames) {
    if (typeof docType.calculatedFields[fieldName] === 'object') {
      doc[fieldName] = executeCalculatedField(docType, doc, fieldName)
    }
  }
}

import { DocType, Doc } from 'sengi-interfaces'

/**
 * Applies default values to the given doc, as defined on the given
 * doc type, for the fields that are required.
 * @param docType A doc type.
 * @param doc A document.
 * @param requiredFieldNames An array of field names.
 */
export function applyDeclaredFieldDefaultsToDocument (docType: DocType, doc: Doc, requiredFieldNames: string[]): void {
  for (const fieldName of requiredFieldNames) {
    if (typeof docType.fields[fieldName] !== 'undefined') {
      const docTypeField = docType.fields[fieldName]

      if (typeof doc[fieldName] === 'undefined' && typeof docTypeField.default !== 'undefined') {
        doc[fieldName] = docTypeField.default
      }
    }
  }
}

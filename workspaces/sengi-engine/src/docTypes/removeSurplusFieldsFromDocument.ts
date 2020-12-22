import { Doc } from 'sengi-interfaces'

/**
 * Removes fields from the given doc that do not appear in the given
 * requiredFieldNames array.  However the id field is always retained.
 * @param doc A document.
 * @param requiredFieldNames An array of field names.
 */
export function removeSurplusFieldsFromDocument (doc: Doc, requiredFieldNames: string[]): void {
  const fieldNames = Object.keys(doc)

  for (const fieldName of fieldNames) {
    if (fieldName !== 'id' && !requiredFieldNames.includes(fieldName)) {
      delete doc[fieldName]
    }
  }
}

import { DocType, Doc, DocSystemFieldNames } from 'sengi-interfaces'

/**
 * Returns a new document containing only the fields that should appear
 * on an instance of the given document type.
 * This should be used just before a document is saved.
 * @param docType A document type.
 * @param doc A document.
 */
export function trimDoc (docType: DocType, doc: Doc): Doc {
  const reducedDoc: Doc = {}

  for (const fieldName in doc) {
    const isSystemFieldName = DocSystemFieldNames.includes(fieldName)
    const isDeclaredField = typeof docType.fields[fieldName] === 'object'
    const isCalculatedField = typeof docType.calculatedFields[fieldName] === 'object'

    if (isSystemFieldName || isDeclaredField || isCalculatedField) {
      reducedDoc[fieldName] = doc[fieldName]
    }
  }

  return reducedDoc
}

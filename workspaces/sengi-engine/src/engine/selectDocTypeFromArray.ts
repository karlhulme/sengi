import { AnyDocType, SengiUnrecognisedDocTypeNameError } from 'sengi-interfaces'

/**
 * Selects the doc type with the given name from the given docTypes array.
 * @param docTypes An array of doc types.
 * @param docTypeName The name of a doc type.
 */
export function selectDocTypeFromArray (docTypes: AnyDocType[], docTypeName: string): AnyDocType {
  const docType = docTypes.find(dt => dt.name === docTypeName)

  if (!docType) {
    throw new SengiUnrecognisedDocTypeNameError(docTypeName)
  }

  return docType
}

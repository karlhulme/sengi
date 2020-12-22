import { DocType, DocStoredField } from 'sengi-interfaces'

/**
 * Extracts the merge parameters from the parameters
 * supplied to the constructor.
 * @param docType A document type.
 * @param constructorParams A set of constructor parameters that includes
 * both the declared constructor fields as well as regular fields intended
 * to be merged into the final document.
 */
export function extractConstructorMergeParams (docType: DocType, constructorParams: Record<string, DocStoredField>): Record<string, DocStoredField> {
  const result: Record<string, DocStoredField> = {}

  for (const fieldName in docType.fields) {
    if (typeof constructorParams[fieldName] !== 'undefined') {
      result[fieldName] = constructorParams[fieldName]
    }
  }

  return result
}

import { DocType, DocStoredField } from 'sengi-interfaces'

/**
 * Extracts the constructor declared parameters from the parameters
 * supplied to the constructor.
 * @param docType A document type.
 * @param constructorParams A set of constructor parameters that includes
 * both the declared constructor fields as well as regular fields intended
 * to be appended to the final document.
 */
export function extractConstructorDeclaredParams (docType: DocType, constructorParams: Record<string, DocStoredField>): Record<string, DocStoredField> {
  const result: Record<string, DocStoredField> = {}

  for (const ctorParameterName in docType.ctor.parameters) {
    if (typeof constructorParams[ctorParameterName] !== 'undefined') {
      result[ctorParameterName] = constructorParams[ctorParameterName]
    }
  }

  return result
}

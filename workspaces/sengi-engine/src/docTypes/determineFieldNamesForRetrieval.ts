import { DocType, DocSystemFieldNames, SengiUnrecognisedFieldNameError } from 'sengi-interfaces'

/**
 * Determines the names of the fields that need to be retrieved
 * to satisfy the required field names.
 * @param docType A doc type.
 * @param requiredFieldNames An array of field names.
 */
export function determineFieldNamesForRetrieval (docType: DocType, requiredFieldNames: string[]): string[] {
  const result: string[] = []

  for (let i = 0; i < requiredFieldNames.length; i++) {
    const fieldName = requiredFieldNames[i]

    const isSystemFN = DocSystemFieldNames.includes(fieldName)
    const isDeclaredFN = typeof docType.fields[fieldName] === 'object'

    if (isSystemFN || isDeclaredFN) {
      if (!result.includes(fieldName)) {
        result.push(fieldName)
      }
    } else if (typeof docType.calculatedFields[fieldName] === 'object') {
      const sourceFieldNames = docType.calculatedFields[fieldName].inputFields

      for (const sourceFieldName of sourceFieldNames) {
        if (!result.includes(sourceFieldName)) {
          result.push(sourceFieldName)
        }
      }
    } else {
      throw new SengiUnrecognisedFieldNameError(docType.name, requiredFieldNames[i])
    }
  }

  return result
}

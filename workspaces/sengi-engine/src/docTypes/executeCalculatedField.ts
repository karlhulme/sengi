import { DocType, Doc, DocFragment, SengiCalculatedFieldFailedError, DocStoredField } from 'sengi-interfaces'

/**
 * Executes the calculated field value function using the inputs taken
 * from the given document and returns the result.
 * This method asserts that the calculated field exists.
 * @param docType A document type.
 * @param doc A document.
 * @param calculatedFieldName The name of a calculated field.
 */
export function executeCalculatedField (docType: DocType, doc: Doc, calculatedFieldName: string ): DocStoredField {
  const docTypeCalculatedField = docType.calculatedFields[calculatedFieldName]
  const input: DocFragment = {}

  for (const inputFieldName of docTypeCalculatedField.inputFields) {
    input[inputFieldName] = doc[inputFieldName]
  }

  try {
    return docTypeCalculatedField.value(input) as DocStoredField
  } catch (err) {
    throw new SengiCalculatedFieldFailedError(docType.name, calculatedFieldName, err)
  }
}

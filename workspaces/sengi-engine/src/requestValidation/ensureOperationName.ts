import { DocType, SengiUnrecognisedOperationNameError } from 'sengi-interfaces'

/**
 * Ensure that the given operation name is an operation defined
 * on the given document type.
 * @param docType A document type.
 * @param operationName The name of an operation.
 */
export function ensureOperationName (docType: DocType, operationName: string): void {
  if (typeof docType.operations[operationName] !== 'object') {
    throw new SengiUnrecognisedOperationNameError(docType.name, operationName)
  }
}

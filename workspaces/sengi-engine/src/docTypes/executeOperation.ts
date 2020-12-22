import {
  Doc,
  DocFragment,
  DocPatch,
  DocType,
  DocTypeOperationImplementation,
  SengiOperationFailedError,
  SengiOperationNonObjectResponseError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'

/**
 * Call operation implementation and wrap any errors raised.
 * @param docTypeName The name of the doc type.
 * @param operationName The name of the operation being called.
 * @param implementation The function to be invoked.
 * @param doc A document.
 * @param operationParams The parameters of an operation.
 */
export function callOperationImplementation (docTypeName: string, operationName: string, implementation: DocTypeOperationImplementation, doc: Doc, operationParams: DocFragment): unknown {
  try {
    return implementation(doc, operationParams)
  } catch (err) {
    throw new SengiOperationFailedError(docTypeName, operationName, err)
  }
}

/**
 * Execute a doc type operation that may alter the given document and
 * will return the result of the operation.
 * @param docType A doc type.
 * @param doc A document that may be amended by the operation.
 * @param operationName The name of an operation.
 * @param operationParams A parameter object to be passed to the operation.
 */
export function executeOperation (docType: DocType, doc: Doc, operationName: string, operationParams: DocFragment): DocPatch {
  const operation = docType.operations[operationName]

  if (typeof operation !== 'object') {
    throw new SengiUnrecognisedOperationNameError(docType.name, operationName)
  }

  const result = callOperationImplementation(docType.name, operationName, operation.implementation, doc, operationParams)

  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new SengiOperationNonObjectResponseError(docType.name, operationName)
  }

  return result as DocPatch
}

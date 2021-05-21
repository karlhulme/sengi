import Ajv from 'ajv'
import {
  AnyDocType, DocRecord,
  SengiOperationFailedError,
  SengiOperationParamsValidationFailedError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Execute an operation on a document.
 * @param ajv A validator.
 * @param docType A document type.
 * @param operationName The name of an operation.
 * @param operationParams A set of operation params.
 * @param doc The document to operation on.
 */
export function executeOperation (ajv: Ajv, docType: AnyDocType, operationName: string, operationParams: unknown, doc: DocRecord): void {
  const operation = docType.operations?.[operationName]
  
  if (typeof operation !== 'object') {
    throw new SengiUnrecognisedOperationNameError(docType.name, operationName)
  }

  if (!ajv.validate(operation.parametersJsonSchema, operationParams)) {
    throw new SengiOperationParamsValidationFailedError(docType.name, operationName, ajvErrorsToString(ajv.errors))
  }

  try {
    operation.implementation(doc, operationParams)
  } catch (err) {
    throw new SengiOperationFailedError(docType.name, operationName, err)
  }
}

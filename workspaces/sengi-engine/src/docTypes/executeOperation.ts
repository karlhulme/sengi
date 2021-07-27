import Ajv from 'ajv'
import {
  AnyDocType, DocRecord,
  SengiAuthorisationFailedError,
  SengiOperationFailedError,
  SengiOperationParamsValidationFailedError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Execute an operation on a document.
 * @param ajv A validator.
 * @param docType A document type.
 * @param user A user object.
 * @param operationName The name of an operation.
 * @param operationParams A set of operation params.
 * @param doc The document to operation on.
 */
export function executeOperation (ajv: Ajv, docType: AnyDocType, user: unknown, operationName: string, operationParams: unknown, doc: DocRecord): void {
  const operation = docType.operations?.[operationName]
  
  if (typeof operation !== 'object') {
    throw new SengiUnrecognisedOperationNameError(docType.name, operationName)
  }

  if (!ajv.validate(operation.parametersJsonSchema, operationParams)) {
    throw new SengiOperationParamsValidationFailedError(docType.name, operationName, ajvErrorsToString(ajv.errors))
  }

  if (operation.authorise) {
    const authFailure = operation.authorise({
      doc,
      parameters: operationParams,
      user
    })

    if (typeof authFailure === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, authFailure)
    }
  }

  try {
    operation.implementation({ doc, user, parameters: operationParams })
  } catch (err) {
    throw new SengiOperationFailedError(docType.name, operationName, err)
  }
}

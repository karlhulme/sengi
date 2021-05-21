/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv'
import {
  AnyDocType,
  SengiQueryResponseValidationFailedError,
  SengiUnrecognisedQueryNameError,
  SengiQueryCoerceFailedError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Coerce the result of executing a query into the published
 * query response shape.
 * @param ajv A validator.
 * @param docType A document type.
 * @param queryName The name of a query.
 * @param queryResult The result of executing the query as returned
 * from the document store.
 */
export function coerceQuery (ajv: Ajv, docType: AnyDocType, queryName: string, queryResult: unknown): any {
  const queryDef = docType.queries?.[queryName]
  
  if (typeof queryDef !== 'object') {
    throw new SengiUnrecognisedQueryNameError(docType.name, queryName)
  }

  let response = null

  try {
    response = queryDef.coerce(queryResult)
  } catch (err) {
    throw new SengiQueryCoerceFailedError(docType.name, queryName, err)
  }

  if (!ajv.validate(queryDef.responseJsonSchema, response)) {
    throw new SengiQueryResponseValidationFailedError(docType.name, queryName, ajvErrorsToString(ajv.errors))
  }
  
  return response
}

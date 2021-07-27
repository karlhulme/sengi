/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv'
import {
  AnyDocType,
  SengiQueryParseFailedError,
  SengiQueryParamsValidationFailedError,
  SengiUnrecognisedQueryNameError,
  SengiAuthorisationFailedError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Parses a set of query params into a query that can be
 * passed to the document store.
 * @param ajv A validator.
 * @param docType A document type.
 * @param user: A user object.
 * @param queryName The name of a query.
 * @param queryParams A set of query params.
 */
export function parseQuery (ajv: Ajv, docType: AnyDocType, user: unknown, queryName: string, queryParams: unknown): any {
  const queryDef = docType.queries?.[queryName]
  
  if (typeof queryDef !== 'object') {
    throw new SengiUnrecognisedQueryNameError(docType.name, queryName)
  }

  if (!ajv.validate(queryDef.parametersJsonSchema, queryParams)) {
    throw new SengiQueryParamsValidationFailedError(docType.name, queryName, ajvErrorsToString(ajv.errors))
  }

  if (queryDef.authorise) {
    const authFailure = queryDef.authorise({
      parameters: queryParams,
      user
    })

    if (typeof authFailure === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, authFailure)
    }
  }
  
  let query = null

  try {
    query = queryDef.parse({ user, parameters: queryParams })
  } catch (err) {
    throw new SengiQueryParseFailedError(docType.name, queryName, err)
  }

  return query
}

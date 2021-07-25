/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv'
import {
  AnyDocType,
  SengiFilterParseFailedError,
  SengiFilterParamsValidationFailedError,
  SengiUnrecognisedFilterNameError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Parses a set of filter params to produce a filter that can be
 * understood by the document store.
 * @param ajv A validator.
 * @param docType A document type.
 * @param user A user object.
 * @param filterName The name of a filter.
 * @param filterParams A set of filter params.
 */
export function parseFilter (ajv: Ajv, docType: AnyDocType, user: unknown, filterName: string, filterParams: unknown): any {
  const filterDef = docType.filters?.[filterName]
  
  if (typeof filterDef !== 'object') {
    throw new SengiUnrecognisedFilterNameError(docType.name, filterName)
  }

  if (!ajv.validate(filterDef.parametersJsonSchema, filterParams)) {
    throw new SengiFilterParamsValidationFailedError(docType.name, filterName, ajvErrorsToString(ajv.errors))
  }

  let filter = null

  try {
    filter = filterDef.parse({ user, parameters: filterParams })
  } catch (err) {
    throw new SengiFilterParseFailedError(docType.name, filterName, err)
  }

  return filter
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv'
import {
  AnyDocType,
  SengiFilterFailedError,
  SengiFilterParamsValidationFailedError,
  SengiUnrecognisedFilterNameError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Execute a filter.
 * @param ajv A validator.
 * @param docType A document type.
 * @param filterName The name of a filter.
 * @param filterParams A set of filter params.
 */
export function executeFilter (ajv: Ajv, docType: AnyDocType, filterName: string, filterParams: unknown): any {
  const filterDef = docType.filters?.[filterName]
  
  if (typeof filterDef !== 'object') {
    throw new SengiUnrecognisedFilterNameError(docType.name, filterName)
  }

  if (!ajv.validate(filterDef.parametersJsonSchema, filterParams)) {
    throw new SengiFilterParamsValidationFailedError(docType.name, filterName, ajvErrorsToString(ajv.errors))
  }

  let filter = null

  try {
    filter = filterDef.parse(filterParams)
  } catch (err) {
    throw new SengiFilterFailedError(docType.name, filterName, err)
  }

  return filter
}

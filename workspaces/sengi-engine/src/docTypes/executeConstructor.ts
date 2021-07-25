import Ajv from 'ajv'
import {
  AnyDocType, DocRecord, SengiConstructorFailedError,
  SengiConstructorNonObjectResponseError, SengiCtorParamsValidationFailedError,
  SengiUnrecognisedCtorNameError
} from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Execute a constructor to produce a new document.
 * @param ajv A validator.
 * @param docType A document type.
 * @param user A user object.
 * @param constructorName The name of a constructor.
 * @param constructorParams A set of constructor params.
 */
export function executeConstructor (ajv: Ajv, docType: AnyDocType, user: unknown,  constructorName: string, constructorParams: unknown): DocRecord {
  const ctor = docType.constructors?.[constructorName]
  
  if (typeof ctor !== 'object') {
    throw new SengiUnrecognisedCtorNameError(docType.name, constructorName)
  }

  if (!ajv.validate(ctor.parametersJsonSchema, constructorParams)) {
    throw new SengiCtorParamsValidationFailedError(docType.name, constructorName, ajvErrorsToString(ajv.errors))
  }

  let result: DocRecord

  try {
    result = ctor.implementation({ user, parameters: constructorParams })
  } catch (err) {
    throw new SengiConstructorFailedError(docType.name, constructorName, err)
  }

  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new SengiConstructorNonObjectResponseError(docType.name, constructorName)
  }

  return result
}

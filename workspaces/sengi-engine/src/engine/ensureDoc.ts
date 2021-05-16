import Ajv from 'ajv'
import { AnyDocType, DocRecord, SengiDocValidationFailedError } from 'sengi-interfaces'
import { ajvErrorsToString } from '../utils'

/**
 * Raises an error if the given doc does not conform to the doc type schema.
 * @param ajv A validator.
 * @param docType A doc type.
 * @param doc A doc to validate.
 */
export function ensureDoc (ajv: Ajv, docType: AnyDocType, doc: DocRecord): void {
  if (!ajv.validate(docType.jsonSchema, doc)) {
    throw new SengiDocValidationFailedError(docType.name, ajvErrorsToString(ajv.errors))
  }
}

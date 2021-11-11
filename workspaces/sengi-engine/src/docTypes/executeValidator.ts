import { AnyDocType, DocRecord, SengiDocTypeValidateFunctionError } from 'sengi-interfaces'

/**
 * Executes the validator function on the given doc type if
 * one is defined and that will raise an error if the validation
 * fails.
 * @param docType A doc type.
 * @param doc A document.
 */
export function executeValidator (docType: AnyDocType, doc: DocRecord): void {
  if (typeof docType.validate === 'function') {
    const validationErrorMessage = docType.validate(doc)

    if (validationErrorMessage) {
      throw new SengiDocTypeValidateFunctionError(docType.name, validationErrorMessage)
    }
  }
}

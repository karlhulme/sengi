import { Doc, DocType, SengiDocTypeValidateFunctionError } from 'sengi-interfaces'

/**
 * Executes the validator function on the given doc type if
 * one is defined and that will raise an error if the validation
 * fails.
 * @param docType A doc type.
 * @param doc A document.
 */
export function executeValidator (docType: DocType, doc: Doc): void {
  if (typeof docType.validate === 'function') {
    try {
      docType.validate(doc)
    } catch (err) {
      throw new SengiDocTypeValidateFunctionError(docType.name, err)
    }
  }
}

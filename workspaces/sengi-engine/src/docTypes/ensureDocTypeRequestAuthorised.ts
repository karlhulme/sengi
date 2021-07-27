import { AnyDocType, DocTypeAuthProps, SengiAuthorisationFailedError } from 'sengi-interfaces'

/**
 * Raises an error if the action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
export function ensureDocTypeRequestAuthorised (docType: AnyDocType, authProps: DocTypeAuthProps<unknown, unknown>): void {
  if (docType.authorise) {
    const result = docType.authorise(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

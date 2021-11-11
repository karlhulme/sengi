import {
  AnyDocType, DocTypeCreateAuthProps, DocTypeDeleteAuthProps,
  DocTypeOperation, DocTypeOperationAuthProps, DocTypePatchAuthProps,
  DocTypeQuery, DocTypeQueryAuthProps, DocTypeReadAuthProps,
  SengiAuthorisationFailedError
} from 'sengi-interfaces'

/**
 * Raises an error if the create action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
 export function ensureDocTypeCreateRequestAuthorised (docType: AnyDocType, authProps: DocTypeCreateAuthProps<unknown, unknown>): void {
  if (docType.authoriseCreate) {
    const result = docType.authoriseCreate(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

/**
 * Raises an error if the delete action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
 export function ensureDocTypeDeleteRequestAuthorised (docType: AnyDocType, authProps: DocTypeDeleteAuthProps<unknown, unknown>): void {
  if (docType.authoriseDelete) {
    const result = docType.authoriseDelete(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

/**
 * Raises an error if the operation action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
export function ensureDocTypeOperationRequestAuthorised (docType: AnyDocType, docTypeOperation: DocTypeOperation<unknown, unknown, unknown>, authProps: DocTypeOperationAuthProps<unknown, unknown, unknown>): void {
  if (docTypeOperation.authorise) {
    const result = docTypeOperation.authorise(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

/**
 * Raises an error if the patch action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
export function ensureDocTypePatchRequestAuthorised (docType: AnyDocType, authProps: DocTypePatchAuthProps<unknown, unknown>): void {
  if (docType.authorisePatch) {
    const result = docType.authorisePatch(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

/**
 * Raises an error if the query action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
export function ensureDocTypeQueryRequestAuthorised (docType: AnyDocType, docTypeQuery: DocTypeQuery<unknown, unknown, unknown, unknown, unknown>, authProps: DocTypeQueryAuthProps<unknown, unknown>): void {
  if (docTypeQuery.authorise) {
    const result = docTypeQuery.authorise(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

/**
 * Raises an error if the read action is not authorised.
 * @param docType The document type to authorise against.
 * @param authProps The properties to be passed to the authorisation function.
 */
export function ensureDocTypeReadRequestAuthorised (docType: AnyDocType, authProps: DocTypeReadAuthProps<unknown, unknown>): void {
  if (docType.authoriseRead) {
    const result = docType.authoriseRead(authProps)

    if (typeof result === 'string') {
      throw new SengiAuthorisationFailedError(docType.name, result)
    }
  }
}

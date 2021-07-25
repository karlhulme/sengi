/**
 * Represents the properties passed to an operation authorisation function.
 */
 export interface DocTypeOperationAuthProps<Doc, User, Parameters> {
  /**
   * The document that is the subject of the authorisation request.
   */
  doc: Doc

  /**
   * The user that made the request.
   */
  user: User

  /**
   * The parameters passed to the operation.
   */
  parameters: Parameters
}

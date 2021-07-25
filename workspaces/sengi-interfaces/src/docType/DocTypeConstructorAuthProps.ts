/**
 * Represents the properties passed to a constructor authorisation function.
 */
 export interface DocTypeConstructorAuthProps<Doc, User, Parameters> {
  /**
   * The document that is the subject of the authorisation request.
   */
  doc: Doc

  /**
   * The user that made the request.
   */
  user: User

  /**
   * The parameters passed to the constructor.
   */
  parameters: Parameters
}

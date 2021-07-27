/**
 * Represents the properties passed to a constructor authorisation function.
 */
 export interface DocTypeConstructorAuthProps<User, Parameters> {
  /**
   * The user that made the request.
   */
  user: User

  /**
   * The parameters passed to the constructor.
   */
  parameters: Parameters
}

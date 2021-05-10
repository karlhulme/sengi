/**
 * Represents a validation error.
 */
export interface ValidationError {
  /**
   * The field that the validation error relates to.
   */
  name: string

  /**
   * The detailed message associated with the error.
   */
  message: string
}

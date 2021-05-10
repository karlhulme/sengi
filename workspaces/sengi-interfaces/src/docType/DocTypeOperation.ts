/**
 * Represents an operation that can be applied to a document.
 */
export interface DocTypeOperation<Doc, Parameters> {
  /**
   * A description of the operation.
   */
  summary: string

  /**
   * If populated, this operation has been deprecated, and this property describes
   * the reason and/or the operation to use instead.
   */
  deprecation?: string

  /**
   * A JSON schema that describes the shape of the parameters to the operation.
   */
  parametersJsonSchema: Record<string, unknown>

  /**
   * A function that updates a document based on the given operation parameters.
   */
  implementation: (doc: Doc, parameters: Parameters) => void
}

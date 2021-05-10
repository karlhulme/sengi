/**
 * Represents the constructor for a document type.
 */
export interface DocTypeConstructor<Doc, Parameters> {
  /**
   * A description of the purpose of the constructor.
   */
  summary: string

  /**
   * A JSON schema that describes the shape of the constructor parameters.
   */
  parametersJsonSchema: Record<string, unknown>

  /**
   * A function that returns a new document based on the given parameters.
   */
  implementation: (parameters: Parameters) => Doc
}

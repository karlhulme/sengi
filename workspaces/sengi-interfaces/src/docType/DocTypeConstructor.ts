import { DocTypeConstructorAuthProps } from './DocTypeConstructorAuthProps'
import { DocTypeConstructorImplProps } from './DocTypeConstructorImplProps'

/**
 * Represents the constructor for a document type.
 */
export interface DocTypeConstructor<Doc, User, Parameters> {
  /**
   * A description of the purpose of the constructor.
   */
  summary?: string

  /**
   * A JSON schema that describes the shape of the constructor parameters.
   */
  parametersJsonSchema: Record<string, unknown>

  /**
   * A function that returns a new document based on the given parameters.
   */
  implementation: (props: DocTypeConstructorImplProps<User, Parameters>) => Doc

  /**
   * A function that returns an authorisation error if the request
   * should not be permitted.
   * The evaluation can be based on the user making the request and/or
   * the document to be amended and/or the constructor parameters.
   */
  authorise?: (req: DocTypeConstructorAuthProps<User, Parameters>) => string|undefined
}

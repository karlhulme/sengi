/**
 * Represents a query that can be executed against a collection of documents.
 */
export interface DocTypeQuery<Response, Parameters, QueryResult, Query> {
  /**
   * A description of the query.
   */
  summary?: string

  /**
   * If populated, this query has been deprecated, and the property describes
   * the reason and/or the query to use instead.
   */
  deprecation?: string

  /**
   * A JSON schema that describes the shape of the query parameters.
   */
  parametersJsonSchema: Record<string, unknown>

  /**
   * A JSON schema that describes the shape of the response of the query.
   */
  responseJsonSchema: Record<string, unknown>

  /**
   * A function that converts the parameters into a Query that the
   * document store can interpret.  The Query type will be dependent
   * upon the choice of document store.
   */
  parse: (parameters: Parameters) => Query

  /**
   * A function that converts the document store result into a response
   * for clients to consume.
   */
  coerce: (commandResult: QueryResult) => Response
}

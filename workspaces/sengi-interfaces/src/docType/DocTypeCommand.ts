/**
 * Represents a command that can be executed against a collection of documents.
 */
export interface DocTypeCommand<Response, Parameters, CommandResult, Command> {
  /**
   * A description of the command.
   */
  summary: string

  /**
   * If populated, this command has been deprecated, and the property describes
   * the reason and/or the command to use instead.
   */
  deprecation?: string

  /**
   * A JSON schema that describes the shape of the command parameters.
   */
  parametersJsonSchema: Record<string, unknown>

  /**
   * A JSON schema that describes the shape of the response of the command.
   */
  responseJsonSchema: string

  /**
   * A function that converts the parameters into a Command that the
   * document store can interpret.  The Command type will be dependent
   * upon the choice of document store.
   */
  parse: (parameters: Parameters) => Command

  /**
   * A function that converts the document store result into a response
   * for clients to consume.
   */
  coerce: (commandResult: CommandResult) => Response
}

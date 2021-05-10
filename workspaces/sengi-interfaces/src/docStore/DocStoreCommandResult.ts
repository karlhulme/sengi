/**
 * The result from a document store of deleting a document.
 */
export interface DocStoreCommandResult<CommandResult> {
  /**
   * A result object that contains the data from the document store
   * as a result of executing a command.
   */
  commandResult: CommandResult
}

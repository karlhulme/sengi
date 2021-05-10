/**
 * Defines the shape of the response following a request to create a document.
 */
export interface CreateDocumentResult {
  /**
   * True if a new document was created.
   */
  isNew: boolean
}

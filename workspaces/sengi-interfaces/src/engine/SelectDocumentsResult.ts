import { DocRecord } from '../doc'

/**
 * Defines the shape of the response following a request to
 * select all documents from a collection.
 */
export interface SelectDocumentsResult {
  /**
   * An array of documents.
   */
  docs: DocRecord[]
}

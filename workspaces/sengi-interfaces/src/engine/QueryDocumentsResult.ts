import { DocFragment } from '../doc'

/**
 * Defines the shape of the response following a request to
 * query for all documents from a collection.
 */
export interface QueryDocumentsResult {
  /**
   * An array of documents.
   */
  docs: DocFragment[]
}

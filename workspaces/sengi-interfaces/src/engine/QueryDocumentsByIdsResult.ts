import { DocFragment } from '../doc'

/**
 * Defines the shape of the response following a request to
 * query for documents using a set of document ids.
 */
export interface QueryDocumentsByIdsResult {
  /**
   * An array of documents.
   */
  docs: DocFragment[]
}

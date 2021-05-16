import { DocRecord } from '../doc'

/**
 * Defines the shape of the response following a request to
 * select for documents using a set of document ids.
 */
export interface SelectDocumentsByIdsResult {
  /**
   * An array of documents.
   */
  docs: DocRecord[]
}

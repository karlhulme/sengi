import { DocRecord } from '../doc'

/**
 * Defines the shape of the response following a request to
 * select documents using a filter.
 */
export interface SelectDocumentsByFilterResult {
  /**
   * An array of documents.
   */
  docs: DocRecord[]
}

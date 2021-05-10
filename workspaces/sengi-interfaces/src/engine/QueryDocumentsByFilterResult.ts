import { DocFragment } from '../doc'

/**
 * Defines the shape of the response following a request to
 * query for documents using a filter.
 */
export interface QueryDocumentsByFilterResult {
  /**
   * An array of documents.
   */
  docs: DocFragment[]
}

import { Doc } from '../doc'

/**
 * The result from a document store of querying a collection of documents.
 */
export interface DocStoreQueryResult {
  /**
   * A collection of documents.
   */
  docs: Doc[]
}

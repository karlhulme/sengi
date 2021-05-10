import { Doc } from '../doc'

/**
 * The result from a document store of fetching a document.
 */
export interface DocStoreFetchResult {
  /**
   * The retrieved document.
   */
  doc: Doc|null
}

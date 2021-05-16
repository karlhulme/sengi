import { DocRecord } from '../doc'

/**
 * The result of fetching a document from a document store.
 */
export interface DocStoreFetchResult {
  /**
   * The retrieved document.
   */
  doc: DocRecord|null
}

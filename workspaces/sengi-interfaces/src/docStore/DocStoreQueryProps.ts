/**
 * The additional parameters that can be supplied when querying for documents. 
 */
export interface DocStoreQueryProps {
  /**
   * The maximum number of documents to return.
   */
  limit?: number

  /**
   * The offset into the collection that the documents should start
   * being returned from.
   */
  offset?: number
}

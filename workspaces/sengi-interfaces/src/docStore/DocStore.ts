import { DocRecord } from '../doc'
import { DocStoreDeleteByIdProps } from './DocStoreDeleteByIdProps'
import { DocStoreDeleteByIdResult } from './DocStoreDeleteByIdResult'
import { DocStoreExistsProps } from './DocStoreExistsProps'
import { DocStoreExistsResult } from './DocStoreExistsResult'
import { DocStoreFetchProps } from './DocStoreFetchProps'
import { DocStoreFetchResult } from './DocStoreFetchResult'
import { DocStoreQueryProps } from './DocStoreQueryProps'
import { DocStoreQueryResult } from './DocStoreQueryResult'
import { DocStoreSelectProps } from './DocStoreSelectProps'
import { DocStoreSelectResult } from './DocStoreSelectResult'
import { DocStoreUpsertProps } from './DocStoreUpsertProps'
import { DocStoreUpsertResult } from './DocStoreUpsertResult'

/**
 * Defines the functions that must be implemented by a document store.
 */
export interface DocStore<DocStoreOptions, Filter, Query, QueryResult> {
  /**
   * Delete a document using a document id.
   */
  deleteById: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreDeleteByIdProps) => Promise<DocStoreDeleteByIdResult>

  /**
   * Determine if a document exists using a document id.
   */
  exists: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreExistsProps) => Promise<DocStoreExistsResult>

  /**
   * Fetch a document using a document id.
   */
  fetch: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreFetchProps) => Promise<DocStoreFetchResult>

  /**
   * Execute a query against a document collection.
   */
  query: (docTypeName: string, docTypePluralName: string, query: Query, options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult<QueryResult>>

  /**
   * Select all the documents of one document type from a collection.
   */
  selectAll: (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: DocStoreOptions, props: DocStoreSelectProps) => Promise<DocStoreSelectResult>

  /**
   * Select the documents of one document type from a collection that
   * satisfy a given filter.
   */
  selectByFilter: (docTypeName: string, docTypePluralName: string, fieldNames: string[], filter: Filter, options: DocStoreOptions, props: DocStoreSelectProps) => Promise<DocStoreSelectResult>

  /**
   * Select the documents of one document type from a collection using a set of document ids.
   */
  selectByIds: (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: DocStoreOptions, props: DocStoreSelectProps) => Promise<DocStoreSelectResult>

  /**
   * Update or insert a document into a collection. 
   */
  upsert: (docTypeName: string, docTypePluralName: string, doc: DocRecord, options: DocStoreOptions, props: DocStoreUpsertProps) => Promise<DocStoreUpsertResult>
}

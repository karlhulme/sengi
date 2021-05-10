import { Doc } from '../doc'
import { DocStoreCommandProps } from './DocStoreCommandProps'
import { DocStoreCommandResult } from './DocStoreCommandResult'
import { DocStoreDeleteByIdProps } from './DocStoreDeleteByIdProps'
import { DocStoreDeleteByIdResult } from './DocStoreDeleteByIdResult'
import { DocStoreExistsProps } from './DocStoreExistsProps'
import { DocStoreExistsResult } from './DocStoreExistsResult'
import { DocStoreFetchProps } from './DocStoreFetchProps'
import { DocStoreFetchResult } from './DocStoreFetchResult'
import { DocStoreQueryProps } from './DocStoreQueryProps'
import { DocStoreQueryResult } from './DocStoreQueryResult'
import { DocStoreUpsertProps } from './DocStoreUpsertProps'
import { DocStoreUpsertResult } from './DocStoreUpsertResult'

/**
 * Defines the functions that must be implemented by a document store.
 */
export interface DocStore<DocStoreOptions, Filter, Command, CommandResult> {
  /**
   * Execute a command against a document collection.
   */
  command: (docTypeName: string, docTypePluralName: string, command: Command, options: DocStoreOptions, props: DocStoreCommandProps) => Promise<DocStoreCommandResult<CommandResult>>

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
   * Fetch all the documents of one document type from a collection.
   */
  queryAll: (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>

  /**
   * Fetch the documents of one document type from a collection that
   * satisfy a given filter.
   */
  queryByFilter: (docTypeName: string, docTypePluralName: string, fieldNames: string[], filter: Filter, options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>

  /**
   * Fetch the documents of one document type from a collection using a set of document ids.
   */
  queryByIds: (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>

  /**
   * Update or insert a document into a collection. 
   */
  upsert: (docTypeName: string, docTypePluralName: string, doc: Doc, options: DocStoreOptions, props: DocStoreUpsertProps) => Promise<DocStoreUpsertResult>
}

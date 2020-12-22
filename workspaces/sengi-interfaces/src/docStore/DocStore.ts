import { Doc } from '../doc'
import { DocStoreDeleteByIdProps } from './DocStoreDeleteByIdProps'
import { DocStoreDeleteByIdResult } from './DocStoreDeleteByIdResult'
import { DocStoreExistsProps } from './DocStoreExistsProps'
import { DocStoreExistsResult } from './DocStoreExistsResult'
import { DocStoreFetchProps } from './DocStoreFetchProps'
import { DocStoreFetchResult } from './DocStoreFetchResult'
import { DocStoreOptions } from './DocStoreOptions'
import { DocStoreQueryProps } from './DocStoreQueryProps'
import { DocStoreQueryResult } from './DocStoreQueryResult'
import { DocStoreUpsertProps } from './DocStoreUpsertProps'
import { DocStoreUpsertResult } from './DocStoreUpsertResult'

export interface DocStore {
  deleteById: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreDeleteByIdProps) => Promise<DocStoreDeleteByIdResult>
  exists: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreExistsProps) => Promise<DocStoreExistsResult>
  fetch: (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreFetchProps) => Promise<DocStoreFetchResult>
  queryAll: (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>
  queryByFilter: (docTypeName: string, docTypePluralName: string, fieldNames: string[], filterExpression: unknown, options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>
  queryByIds: (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: DocStoreOptions, props: DocStoreQueryProps) => Promise<DocStoreQueryResult>
  upsert: (docTypeName: string, docTypePluralName: string, doc: Doc, options: DocStoreOptions, props: DocStoreUpsertProps) => Promise<DocStoreUpsertResult>
}

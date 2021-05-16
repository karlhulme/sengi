/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocTypeConstructor } from './DocTypeConstructor'
import { DocTypeFilter } from './DocTypeFilter'
import { DocTypeOperation } from './DocTypeOperation'
import { DocTypeQuery } from './DocTypeQuery'
import { DocTypePolicy } from './DocTypePolicy'
import { DocBase } from '../doc'

/**
 * Represents a type of document that can be stored and managed.
 * The constructor, filter and operations all work with parameter objects
 * where any type could be used.  This is preferred to unknown, because it
 * allows a doc type author to use their strongly typed interface directly
 * in the implementation parameter declaration.  It is safe to do this
 * provided the correct jsonSchema has also been supplied. 
 */
export interface DocType<Doc extends DocBase, DocStoreOptions, Filter, Query, QueryResult> {
  /**
   * The name of the document type.
   */
  name: string

  /**
   * The plural name of the document type.
   */
  pluralName: string

  /**
   * The title of the document type.
   */
  title?: string

  /**
   * The plural title of the document type.
   */
  pluralTitle?: string

  /**
   * A description of the usage of the document type.
   */
  summary?: string

  /**
   * A JSON schema that fully describes the acceptable shape of this document type.
   */
  jsonSchema: Record<string, unknown>

  /**
   * The names of the fields that cannot be patched directly.  These fields can be
   * set by operations, constructors and a preSave function.  System field names
   * are treated as readonly automatically.  
   */
  readonlyFieldNames?: string[]

  /**
   * If populated, this document type has been deprecated, and this property describes
   * the reason and/or the document type to use in it's place.
   */
  deprecation?: string

  /**
   * A record of constructors that can be used to build new documents.
   */
  constructors?: Record<string, DocTypeConstructor<Doc, any>>

  /**
   * A record of filters that can be used to extract sections of the
   * document collection.
   */
  filters?: Record<string, DocTypeFilter<Filter, any>>

  /**
   * A record of operations that can be used to update a document.
   */
  operations?: Record<string, DocTypeOperation<Doc, any>>

  /**
   * A record of queries that can be executed against a document collection.
   */
  queries?: Record<string, DocTypeQuery<any, any, QueryResult, Query>>

  /**
   * A function that can perform cleanup adjustments on a document, such as removing 
   * deprecated fields.  It should operate directly on the given document.
   */
  preSave?: (doc: Doc) => void

  /**
   * A function that raises an Error if the given doc does not contain valid field values. 
   * This function is used to perform validation where fields might depend upon each other.
   */
  validate?: (doc: Doc) => void

  /**
   * The policy of the document type that governs which high level actions
   * can be invoked by clients.
   */
  policy?: DocTypePolicy

  /**
   * Options that will be passed to the document store.
   * The type of data will be dependent on the choice of document store.
   */
  docStoreOptions?: DocStoreOptions
}

// interface Shape {
//   id?: string
//   docType?: string
//   docOpIds?: string[]
//   sides?: number
//   area?: number
// }

// interface AwsDocStoreOptions {
//   whatever: string
// }

// interface AwsFilter {
//   a: number
// }

// interface AwsQuery {
//   findMe: string
// }

// interface AwsQueryResult {
//   answer: string
// }

// interface NewExampleParams {
//   x: string
//   y: boolean
// }

// const exampleDocType: DocType<Shape, AwsDocStoreOptions, AwsFilter, AwsQuery, AwsQueryResult> = {
//   name: 'example',
//   pluralName: 'Examples',
//   title: 'Example',
//   pluralTitle: 'Examples',
//   summary: 'This is the example.',
//   jsonSchema: {},
//   constructors: {
//     newExample: {
//       summary: 'Create a new example',
//       parametersJsonSchema: {},
//       implementation: (params: NewExampleParams) => {
//         return ({
//           area: params.x.length,
//           sides: 2
//         })
//       }
//     }
//   },
//   docStoreOptions: {
//     whatever: 'some value'
//   }
// }
// console.log(exampleDocType)

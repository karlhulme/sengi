/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocTypeCommand } from './DocTypeCommand'
import { DocTypeConstructor } from './DocTypeConstructor'
import { DocTypeFilter } from './DocTypeFilter'
import { DocTypeOperation } from './DocTypeOperation'
import { DocTypePolicy } from './DocTypePolicy'

/**
 * Represents a type of document that can be stored and managed.
 */
export interface DocType<Doc, DocStoreOptions, Filter, CommandResult, Command> {
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
  title: string

  /**
   * The plural title of the document type.
   */
  pluralTitle: string

  /**
   * A description of the usage of the document type.
   */
  summary: string

  /**
   * A JSON schema that fully describes the acceptable shape of this document type.
   */
  jsonSchema: Record<string, unknown>

  /**
   * The names of the fields that cannot be patched. 
   */
  locked?: string[]

  /**
   * If populated, this document type has been deprecated, and this property describes
   * the reason and/or the document type to use in it's place.
   */
  deprecation?: string

  /**
   * A constructor for this document type.
   */
  ctor?: DocTypeConstructor<Doc, any>

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
   * A record of commands that can be executed against a document collection.
   */
  commands?: Record<string, DocTypeCommand<any, any, CommandResult, Command>>

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

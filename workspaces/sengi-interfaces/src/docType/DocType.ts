import { DocTypeField } from './DocTypeField'
import { DocTypeCalculatedField } from './DocTypeCalculatedField'
import { DocTypeFilter } from './DocTypeFilter'
import { DocTypeAggregate } from './DocTypeAggregate'
import { DocTypeConstructor } from './DocTypeConstructor'
import { DocTypeOperation } from './DocTypeOperation'
import { DocTypePolicy } from './DocTypePolicy'
import { DocStoreOptions } from '../docStore'
import { Doc, DocExample, DocPatchExample } from '../doc'

export interface DocType {
  name: string
  pluralName: string
  title: string
  pluralTitle: string
  summary: string
  documentation: string

  fields: Record<string, DocTypeField>

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

  examples: DocExample[]
  patchExamples: DocPatchExample[]

  calculatedFields: Record<string, DocTypeCalculatedField>
  filters: Record<string, DocTypeFilter>
  aggregates: Record<string, DocTypeAggregate>
  ctor: DocTypeConstructor
  operations: Record<string, DocTypeOperation>

  policy: DocTypePolicy
  docStoreOptions: DocStoreOptions
}

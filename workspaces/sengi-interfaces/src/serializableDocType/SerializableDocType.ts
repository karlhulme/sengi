import { SerializableDocTypeField } from './SerializableDocTypeField'
import { SerializableDocTypeCalculatedField } from './SerializableDocTypeCalculatedField'
import { SerializableDocTypeFilter } from './SerializableDocTypeFilter'
import { SerializableDocTypeAggregate } from './SerializableDocTypeAggregate'
import { SerializableDocTypeConstructor } from './SerializableDocTypeConstructor'
import { SerializableDocTypeOperation } from './SerializableDocTypeOperation'
import { DocExample } from '../doc'

export interface SerializableDocType {
  name: string
  pluralName: string
  title: string
  pluralTitle: string
  summary: string
  documentation: string
  fields: Record<string, SerializableDocTypeField>
  examples: DocExample[]
  calculatedFields: Record<string, SerializableDocTypeCalculatedField>
  filters: Record<string, SerializableDocTypeFilter>
  aggregates: Record<string, SerializableDocTypeAggregate>
  ctor: SerializableDocTypeConstructor
  operations: Record<string, SerializableDocTypeOperation>
}

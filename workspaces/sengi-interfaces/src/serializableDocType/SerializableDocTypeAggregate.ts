import { SerializableDocTypeAggregateField } from './SerializableDocTypeAggregateField'
import { SerializableDocTypeAggregateParameter } from './SerializableDocTypeAggregateParameter'
import { DocFragmentExample } from '../doc'

export interface SerializableDocTypeAggregate {
  title: string
  documentation: string
  parameters: Record<string, SerializableDocTypeAggregateParameter>
  fields: Record<string, SerializableDocTypeAggregateField>
  examples: DocFragmentExample[]
  deprecation?: string
}

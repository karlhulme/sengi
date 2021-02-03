import { DocFragmentExample } from '../doc'
import { SerializableDocTypeFilterParameter } from './SerializableDocTypeFilterParameter'

export interface SerializableDocTypeFilter {
  title: string
  documentation: string
  parameters: Record<string, SerializableDocTypeFilterParameter>
  examples: DocFragmentExample[]
  deprecation?: string
}

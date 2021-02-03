import { DocFragmentExample } from '../doc'
import { SerializableDocTypeOperationParameter } from './SerializableDocTypeOperationParameter'

export interface SerializableDocTypeOperation {
  title: string
  documentation: string
  parameters: Record<string, SerializableDocTypeOperationParameter>
  examples: DocFragmentExample[]
  deprecation?: string
}

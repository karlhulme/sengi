import { DocFragmentExample } from '../doc'
import { SerializableDocTypeConstructorParameter } from './SerializableDocTypeConstructorParameter'

export interface SerializableDocTypeConstructor {
  title: string
  documentation: string
  parameters: Record<string, SerializableDocTypeConstructorParameter>
  examples: DocFragmentExample[]
}

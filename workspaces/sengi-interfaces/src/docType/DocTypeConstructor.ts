import { DocFragmentExample } from '../doc'
import { DocTypeConstructorParameter } from './DocTypeConstructorParameter'
import { DocTypeConstructorImplementation } from './DocTypeConstructorImplementation'

export interface DocTypeConstructor {
  title: string
  documentation: string
  parameters: Record<string, DocTypeConstructorParameter>

  /**
   * A function that returns an initial document.
   */
  implementation: DocTypeConstructorImplementation

  examples: DocFragmentExample[]
}

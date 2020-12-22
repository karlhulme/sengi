import { DocFragmentExample } from '../doc'
import { DocTypeOperationImplementation } from './DocTypeOperationImplementation'
import { DocTypeOperationParameter } from './DocTypeOperationParameter'

export interface DocTypeOperation {
  title: string
  documentation: string
  parameters: Record<string, DocTypeOperationParameter>

  /**
   * A function that returns an initial document.
   */
  implementation: DocTypeOperationImplementation

  examples: DocFragmentExample[]
  deprecation?: string
}

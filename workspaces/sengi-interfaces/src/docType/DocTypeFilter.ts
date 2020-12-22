import { DocFragmentExample } from '../doc'
import { DocTypeFilterParameter } from './DocTypeFilterParameter'
import { DocTypeFilterImplementation } from './DocTypeFilterImplementation'

export interface DocTypeFilter {
  title: string
  documentation: string
  parameters: Record<string, DocTypeFilterParameter>

  /**
   * A function (inputs) that returns an object or value
   * that the document store is able to interpret as a filter.
   */
  implementation: DocTypeFilterImplementation

  examples: DocFragmentExample[]
  deprecation?: string
}

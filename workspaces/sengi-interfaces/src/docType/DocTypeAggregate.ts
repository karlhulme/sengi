import { DocFragmentExample } from '../doc'
import { DocTypeAggregateField } from './DocTypeAggregateField'
import { DocTypeAggregateParameter } from './DocTypeAggregateParameter'
import { DocTypeAggregateImplementation } from './DocTypeAggregateImplementation'

export interface DocTypeAggregate {
  title: string
  documentation: string
  parameters: Record<string, DocTypeAggregateParameter>
  fields: Record<string, DocTypeAggregateField>

  /**
   * A function (inputs) that returns an object or value
   * that the document store is able to interpret as an aggregate.
   */
  implementation: DocTypeAggregateImplementation

  examples: DocFragmentExample[]
  deprecation?: string
}

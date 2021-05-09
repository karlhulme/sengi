/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocTypePolicy } from './DocTypePolicy'
import { DocStoreOptions } from '../docStore'

export interface DocTypeConstructor<Doc, Parameters> {
  summary: string
  deprecation?: string
  parametersJsonSchema: string
  implementation: (parameters: Parameters) => Doc
}

export interface DocTypeFilter<Filter, Parameters> {
  summary: string
  deprecation?: string
  parametersJsonSchema: string
  implementation: (parameters: Parameters) => Filter
}

export interface DocTypeOperation<Doc, Parameters> {
  summary: string
  deprecation?: string
  parametersJsonSchema: string
  implementation: (doc: Doc, parameters: Parameters) => void
}

export interface DocTypeAggregate<Response, Parameters> {
  summary: string
  deprecation?: string
  responseJsonSchema: string
  parametersJsonSchema: string
  implementation: (parameters: Parameters) => Response
}

export interface DocType<Doc, Filter> {
  name: string
  pluralName: string
  title: string
  pluralTitle: string
  summary: string

  jsonSchema: string

  ctor?: DocTypeConstructor<Doc, any>

  filters?: Record<string, DocTypeFilter<Filter, any>>

  operations?: Record<string, DocTypeOperation<Doc, any>>

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

  policy?: DocTypePolicy

  docStoreOptions?: DocStoreOptions
}

export interface FieldShape {
  a: string
  b: number
  c: boolean
} 

export interface ExampleParameters {
  d: string
  e: number
}

export interface ExampleFilter {
  awsId: string
  awsSort: string
}

export interface ExampleAggegate {
  getCount: boolean
}

const testDocType: DocType<FieldShape, ExampleFilter> = {
  name: 'test',
  pluralName: 'tests',
  title: 'Test',
  pluralTitle: 'Tests',
  summary: 'Use the type as follows...',
  jsonSchema: 'type=object,properties,etc,etc',
  ctor: {
    summary: 'Create a new instance of the type.',
    parametersJsonSchema: '....',
    implementation: (parameters: ExampleParameters) => ({
      a: parameters.d,
      b: 123,
      c: true
    })
  },
  filters: {
    byExample: {
      summary: 'A filter',
      parametersJsonSchema: '...',
      implementation: (parameters: ExampleParameters) => ({
        awsId: parameters.d,
        awsSort: 'up'
      })
    }
  },
  operations: {
    addSignature: {
      summary: 'Add Signature',
      parametersJsonSchema: '...',
      implementation: (doc, parameters: ExampleParameters) => {
        doc.a = parameters.d
      }
    }
  },
  preSave: shape => {
    shape.a = 'something else'
  },
  validate: shape => {
    if (shape.a === 'whatever') {
      throw new Error()
    }
  }
}

console.log(testDocType)

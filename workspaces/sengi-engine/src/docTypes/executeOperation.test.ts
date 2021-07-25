import { expect, test } from '@jest/globals'
import {
  DocBase, DocRecord, DocType,
  DocTypeOperation,
  SengiOperationFailedError,
  SengiOperationParamsValidationFailedError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'
import { createValidator } from './shared.test'
import { executeOperation } from './executeOperation'
import { asError } from '../utils'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleOperationParams {
  opPropA: string
}

const exampleOperationSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    opPropA: { type: 'string' }
  },
  required: ['opPropA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    operations: {
      work: {
        parametersJsonSchema: exampleOperationSchema,
        implementation: props => {
          if (props.parameters.opPropA === 'fail') {
            throw new Error('fail')
          }

          props.doc.propA = props.parameters.opPropA
        }
      } as DocTypeOperation<ExampleDoc, unknown, ExampleOperationParams>
    }
  }

  return docType
}

test('Accept valid operation request.', () => {
  const doc: DocRecord = { id: 'abc', propA: 'old' }
  expect(() => executeOperation(createValidator(), createDocType(), null, 'work', { opPropA: 'abc' }, doc)).not.toThrow()
  expect(doc).toEqual({ id: 'abc', propA: 'abc' })
})

test('Reject operation request with an unrecognised name.', () => {
  expect(() => executeOperation(createValidator(), createDocType(), null, 'unrecognised', { opPropA: 'abc' }, {})).toThrow(asError(SengiUnrecognisedOperationNameError))
})

test('Reject operation request if no operations defined.', () => {
  const docType = createDocType()
  delete docType.operations
  expect(() => executeOperation(createValidator(), docType, null, 'unrecognised', { opPropA: 'abc' }, {})).toThrow(asError(SengiUnrecognisedOperationNameError))
})

test('Reject operation request with invalid parameters.', () => {
  expect(() => executeOperation(createValidator(), createDocType(), null, 'work', { opPropA: 123 }, {})).toThrow(asError(SengiOperationParamsValidationFailedError))
})

test('Reject operation request if operation raises error.', () => {
  expect(() => executeOperation(createValidator(), createDocType(), null, 'work', { opPropA: 'fail' }, {})).toThrow(asError(SengiOperationFailedError))
})

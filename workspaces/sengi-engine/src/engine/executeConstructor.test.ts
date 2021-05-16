import { expect, test } from '@jest/globals'
import { DocBase, DocType, SengiCtorParamsValidationFailedError, SengiUnrecognisedCtorNameError } from 'sengi-interfaces'
import { asError, createValidator } from './shared.test'
import { executeConstructor } from './executeConstructor'

interface ExampleDoc extends DocBase {
  propA: string
}

interface ExampleConstructorParams {
  ctorPropA: string
}

const exampleConstructorSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    propA: { type: 'string' }
  }
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    constructors: {
      make: {
        summary: 'Make a film',
        parametersJsonSchema: exampleConstructorSchema,
        implementation: (params: ExampleConstructorParams) => ({
          propA: params.ctorPropA
        })
      }
    }
  }

  return docType
}

test('Accept valid construction request.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { propA: 'abc' })).not.toThrow()
})

test('Reject construction request with an unrecognised name.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'unrecognised', { propA: 'abc' })).toThrow(asError(SengiUnrecognisedCtorNameError))
})

test('Reject construction request with invalid parameters.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { propA: 123 })).toThrow(asError(SengiCtorParamsValidationFailedError))
})

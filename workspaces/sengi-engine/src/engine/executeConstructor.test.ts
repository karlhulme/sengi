import { expect, test } from '@jest/globals'
import { DocBase, DocType, SengiConstructorFailedError, SengiConstructorNonObjectResponseError, SengiCtorParamsValidationFailedError, SengiUnrecognisedCtorNameError } from 'sengi-interfaces'
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
    ctorPropA: { type: 'string' }
  },
  required: ['ctorPropA']
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    constructors: {
      make: {
        parametersJsonSchema: exampleConstructorSchema,
        implementation: (params: ExampleConstructorParams) => {
          if (params.ctorPropA === 'fail') {
            throw new Error('fail')
          }

          if (params.ctorPropA === 'null') {
            return null as unknown as ExampleDoc
          }

          return {
            propA: params.ctorPropA
          }
        }
      }
    }
  }

  return docType
}

test('Accept valid construction request.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { ctorPropA: 'abc' })).not.toThrow()
})

test('Reject construction request with an unrecognised name.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'unrecognised', { ctorPropA: 'abc' })).toThrow(asError(SengiUnrecognisedCtorNameError))
})

test('Reject construction request if no constructors defined.', () => {
  const docType = createDocType()
  delete docType.constructors
  expect(() => executeConstructor(createValidator(), docType, 'unrecognised', { ctorPropA: 'abc' })).toThrow(asError(SengiUnrecognisedCtorNameError))
})

test('Reject construction request with invalid parameters.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { ctorPropA: 123 })).toThrow(asError(SengiCtorParamsValidationFailedError))
})

test('Reject construction request if constructor raises error.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { ctorPropA: 'fail' })).toThrow(asError(SengiConstructorFailedError))
})

test('Reject construction request if constructor does not return an object.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), 'make', { ctorPropA: 'null' })).toThrow(asError(SengiConstructorNonObjectResponseError))
})

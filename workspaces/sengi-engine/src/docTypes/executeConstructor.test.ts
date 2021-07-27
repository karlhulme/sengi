import { expect, test } from '@jest/globals'
import { DocBase, DocType, DocTypeConstructor, SengiAuthorisationFailedError, SengiConstructorFailedError, SengiConstructorNonObjectResponseError, SengiCtorParamsValidationFailedError, SengiUnrecognisedCtorNameError } from 'sengi-interfaces'
import { createValidator } from './shared.test'
import { executeConstructor } from './executeConstructor'
import { asError } from '../utils'

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
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    constructors: {
      make: {
        parametersJsonSchema: exampleConstructorSchema,
        implementation: props => {
          if (props.parameters.ctorPropA === 'fail') {
            throw new Error('fail')
          }

          if (props.parameters.ctorPropA === 'null') {
            return null as unknown as ExampleDoc
          }

          return {
            propA: props.parameters.ctorPropA
          }
        },
        authorise: props => {
          if (props.parameters.ctorPropA === 'noAuth') {
            return 'noAuth'
          }
        }
      } as DocTypeConstructor<ExampleDoc, unknown, ExampleConstructorParams>
    }
  }

  return docType
}

test('Accept valid construction request.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'make', { ctorPropA: 'abc' })).not.toThrow()
})

test('Reject construction request with an unrecognised name.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'unrecognised', { ctorPropA: 'abc' })).toThrow(asError(SengiUnrecognisedCtorNameError))
})

test('Reject construction request if no constructors defined.', () => {
  const docType = createDocType()
  delete docType.constructors
  expect(() => executeConstructor(createValidator(), docType, null, 'unrecognised', { ctorPropA: 'abc' })).toThrow(asError(SengiUnrecognisedCtorNameError))
})

test('Reject construction request with invalid parameters.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'make', { ctorPropA: 123 })).toThrow(asError(SengiCtorParamsValidationFailedError))
})

test('Reject construction request if constructor raises error.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'make', { ctorPropA: 'fail' })).toThrow(asError(SengiConstructorFailedError))
})

test('Reject construction request if constructor does not return an object.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'make', { ctorPropA: 'null' })).toThrow(asError(SengiConstructorNonObjectResponseError))
})

test('Reject construction request if authorisation fails.', () => {
  expect(() => executeConstructor(createValidator(), createDocType(), null, 'make', { ctorPropA: 'noAuth' })).toThrow(asError(SengiAuthorisationFailedError))
})

test('Skip construction authorisation if no authorisation method defined.', () => {
  const docType = createDocType()
  delete docType.constructors?.make.authorise
  expect(() => executeConstructor(createValidator(), docType, null, 'make', { ctorPropA: 'noAuth' })).not.toThrow()
})

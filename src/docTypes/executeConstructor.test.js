/* eslint-env jest */
import {
  SengiConstructorFailedError
} from '../errors'
import { executeConstructor } from './executeConstructor'

const docType = {
  name: 'example',
  ctor: {
    parameters: {
      propA: { type: 'string' },
      propB: { type: 'string' }
    },
    implementation: input => ({ combined: input.propA + input.propB })
  }
}

const faultyDocType = {
  name: 'example',
  ctor: {
    parameters: {},
    implementation: input => { throw new Error('wrong') }
  }
}

test('Executing a doc type constructor with valid parameters creates a doc.', () => {
  expect(executeConstructor(docType, { propA: 'hello', propB: 'world' })).toEqual({ combined: 'helloworld' })
})

test('Executing a faulty doc type constructor raises an error.', () => {
  expect(() => executeConstructor(faultyDocType, { a: 123 })).toThrow(SengiConstructorFailedError)
  expect(() => executeConstructor(faultyDocType, { a: 123 })).toThrow(/Error: wrong/)
})

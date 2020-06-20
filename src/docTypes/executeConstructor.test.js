/* eslint-env jest */
const {
  JsonotronConstructorFailedError,
  JsonotronConstructorNotDefinedError
} = require('jsonotron-errors')
const executeConstructor = require('./executeConstructor')

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

test('Executing a doc type constructor with no constructor defined raises an error.', () => {
  expect(() => executeConstructor({ name: 'faulty' }, { propA: 'hello', propB: null })).toThrow(JsonotronConstructorNotDefinedError)
})

test('Executing a faulty doc type constructor raises an error.', () => {
  expect(() => executeConstructor(faultyDocType, { a: 123 })).toThrow(JsonotronConstructorFailedError)
  expect(() => executeConstructor(faultyDocType, { a: 123 })).toThrow(/Error: wrong/)
})

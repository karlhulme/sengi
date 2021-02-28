import { expect, test } from '@jest/globals'
import { DocType, SengiConstructorFailedError, SengiConstructorNonObjectResponseError } from 'sengi-interfaces'
import { executeConstructor } from './executeConstructor'
import { createCarDocType } from './shared.test'

function createDocTypeWithValidConstructor (): DocType {
  const docType = createCarDocType()
  
  docType.ctor = {
    title: 'New car',
    documentation: '',
    examples: [],
    parameters: {
      propA: { type: 'string', documentation: '' },
      propB: { type: 'string', documentation: '' }
    },
    implementation: (ctorParams, mergeParams) => ({
      combined: ctorParams.propA + ' ' + ctorParams.propB,
      other: mergeParams.propC
    })
  }

  return docType
}

function createDocTypeWithErroringConstructor (): DocType {
  const docType = createCarDocType()
  
  docType.ctor = {
    title: 'New car',
    documentation: '',
    examples: [],
    parameters: {
    },
    implementation: () => { throw new Error('wrong') }
  }

  return docType
}

function createDocTypeWithConstructorThatReturnsString (): DocType {
  const docType = createCarDocType()
  
  docType.ctor = {
    title: 'New car',
    documentation: '',
    examples: [],
    parameters: {
    },
    implementation: () => 'not an object'
  }

  return docType
}

test('Executing a doc type constructor with valid parameters creates a doc.', () => {
  expect(executeConstructor(createDocTypeWithValidConstructor(), { propA: 'hello', propB: 'world' }, { propC: 'foo' })).toEqual({ combined: 'hello world', other: 'foo' })
})

test('Executing a doc type constructor that returns a non-object raises an error.', () => {
  try {
    executeConstructor(createDocTypeWithConstructorThatReturnsString(), {}, {})
  } catch (err) {
    expect(err).toBeInstanceOf(SengiConstructorNonObjectResponseError)
    expect(err.message).toMatch(/failed to return an object./)
  }
})

test('Executing a faulty doc type constructor raises an error.', () => {
  try {
    executeConstructor(createDocTypeWithErroringConstructor(), {}, {})
  } catch (err) {
    expect(err).toBeInstanceOf(SengiConstructorFailedError)
    expect(err.message).toMatch(/Error: wrong/)
  }
})

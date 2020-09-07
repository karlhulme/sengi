/* eslint-env jest */
import { extractConstructorDeclaredParams } from './extractConstructorDeclaredParams'

const docType = {
  fields: {
    genFieldA: {},
    genFieldB: {},
    genFieldC: {}
  },
  ctor: {
    parameters: {
      ctorPropD: {},
      ctorPropE: {},
      ctorPropF: {}
    }
  }
}

const constructorParams = {
  genFieldA: 'aaa',
  genFieldB: 'bbb',
  ctorPropD: 'ddd',
  ctorPropE: 'eee',
  unknownF: 'fff'
}

test('Extract the constructor declared parameters.', () => {
  expect(extractConstructorDeclaredParams(docType, constructorParams)).toEqual({
    ctorPropD: 'ddd',
    ctorPropE: 'eee'
  })
})

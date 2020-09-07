/* eslint-env jest */
import { extractConstructorMergeParams } from './extractConstructorMergeParams'

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

test('Extract the constructor merge parameters.', () => {
  expect(extractConstructorMergeParams(docType, constructorParams)).toEqual({
    genFieldA: 'aaa',
    genFieldB: 'bbb'
  })
})

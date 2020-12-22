import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { extractConstructorMergeParams } from './extractConstructorMergeParams'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.fields = {
    genFieldA: { type: 'string', documentation: '' },
    genFieldB: { type: 'string', documentation: '' },
    genFieldC: { type: 'string', documentation: '' },
  }

  docType.ctor.parameters = {
    ctorPropD: { type: 'string', documentation: '' },
    ctorPropE: { type: 'string', documentation: '' },
    ctorPropF: { type: 'string', documentation: '' },
  }

  return docType
}

test('Extract the constructor merge parameters.', () => {
  const constructorParams = {
    genFieldA: 'aaa',
    genFieldB: 'bbb',
    ctorPropD: 'ddd',
    ctorPropE: 'eee',
    unknownF: 'fff'
  }

  expect(extractConstructorMergeParams(createDocType(), constructorParams)).toEqual({
    genFieldA: 'aaa',
    genFieldB: 'bbb'
  })
})

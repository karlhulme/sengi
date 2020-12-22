import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedFilterNameError, SengiFilterFailedError } from 'sengi-interfaces'
import { evaluateFilter } from './evaluateFilter'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()
  
  docType.filters = {
    byNumber: {
      title: 'byNumber',
      documentation: '',
      examples: [],
      parameters: {},
      implementation: input => (input.a as number) * 2
    },
    faulty: {
      title: 'faulty',
      documentation: '',
      examples: [],
      parameters: {},
      implementation: () => { throw new Error('bad') }
    }
  }

  return docType
}

test('Evaluate a doc type filter with valid parameters.', () => {
  expect(evaluateFilter(createDocType(), 'byNumber', { a: 123 })).toEqual(246)
})

test('Evaluating an unknown doc type filter raises an error.', () => {
  try {
    evaluateFilter(createDocType(), 'madeup', { a: 123 })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedFilterNameError)
    expect(err.message).toMatch(/madeup/)
  }
})

test('Evaluating a faulty doc type filter raises an error.', () => {
  try {
    evaluateFilter(createDocType(), 'faulty', { a: 123 })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiFilterFailedError)
    expect(err.message).toMatch(/Error: bad/)
  }
})

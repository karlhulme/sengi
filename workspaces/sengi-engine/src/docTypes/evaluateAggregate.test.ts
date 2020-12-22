import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedAggregateNameError, SengiAggregateFailedError } from 'sengi-interfaces'
import { evaluateAggregate } from './evaluateAggregate'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()
  
  docType.aggregates = {
    docCount: {
      title: 'Document Count',
      documentation: '',
      fields: {
        result: { type: 'number', documentation: '' }
      },
      parameters: {},
      examples: [],
      implementation: () => 'SELECT VALUE COUNT'
    },

    faulty: {
      title: 'Document Count',
      documentation: '',
      fields: {
        result: { type: 'number', documentation: '' }
      },
      parameters: {},
      examples: [],
      implementation: () => { throw new Error('bad')}
    }
  }

  return docType
}

test('Evaluate a doc type aggregate with valid parameters.', () => {
  expect(evaluateAggregate(createDocType(), 'docCount', {})).toEqual('SELECT VALUE COUNT')
})

test('Evaluating an unknown doc type aggregate raises an error.', () => {
  try {
    evaluateAggregate(createDocType(), 'madeup', {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedAggregateNameError)
    expect(err.message).toMatch(/madeup/)
  }
})

test('Evaluating a faulty doc type aggregate raises an error.', () => {
  try {
    evaluateAggregate(createDocType(), 'faulty', {})
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiAggregateFailedError)
    expect(err.message).toMatch(/Error: bad/)
  }
})

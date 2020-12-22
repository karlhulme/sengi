import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedAggregateNameError } from 'sengi-interfaces'
import { ensureAggregateName } from './ensureAggregateName'
import { createFilmDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createFilmDocType()
  
  docType.aggregates = {
    docCount: {
      title: 'Document Count',
      documentation: '',
      fields: {
        result: { type: 'number', documentation: '' }
      },
      parameters: {},
      examples: [],
      implementation: () => 123
    }
  }

  return docType
}

test('Accept recognised aggregate names.', () => {
  expect(() => ensureAggregateName(createDocType(), 'docCount')).not.toThrow()
})

test('Reject unrecognised aggregate names.', () => {
  try {
    ensureAggregateName(createDocType(), 'madeup')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedAggregateNameError)
    expect(err.aggregateName).toEqual('madeup')
  }
})

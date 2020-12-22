import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedFieldNameError } from 'sengi-interfaces'
import { determineFieldNamesForRetrieval } from './determineFieldNamesForRetrieval'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()
  
  docType.fields = {
    a: { type: 'string', documentation: '' },
    b: { type: 'string', documentation: '' },
    c: { type: 'string', documentation: '' }
  }

  docType.calculatedFields = {
    combined: {
      type: 'string',
      documentation: '',
      inputFields: ['a', 'b'],
      value: inputs => inputs.a + ' ' + inputs.b
    },
    noInputs: {
      type: 'string',
      documentation: '',
      inputFields: [],
      value: () => 5 
    }
  }

  return docType
}

test('Identify system fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(createDocType(), ['id'])).toEqual(['id'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['id', 'id'])).toEqual(['id'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['docType'])).toEqual(['docType'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['id', 'docOps', 'docVersion'])).toEqual(['id', 'docOps', 'docVersion'])
})

test('Identify declared fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(createDocType(), ['a', 'b'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['a', 'a', 'a'])).toEqual(['a'])
})

test('Identify calculated fields for retrieval.', () => {
  expect(determineFieldNamesForRetrieval(createDocType(), ['combined'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['combined', 'combined'])).toEqual(['a', 'b'])
  expect(determineFieldNamesForRetrieval(createDocType(), ['noInputs'])).toEqual([])
})

test('Fail to identify fields for retrieval that are neither declared, calculated or system.', () => {
  try {
    determineFieldNamesForRetrieval(createDocType(), ['invalid'])
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedFieldNameError)
    expect(err.message).toMatch(/invalid/)
  }
})

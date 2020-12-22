import { expect, test } from '@jest/globals'
import { DocType, SengiUnrecognisedFilterNameError } from 'sengi-interfaces'
import { ensureFilterName } from './ensureFilterName'
import { createFilmDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createFilmDocType()
  
  docType.filters = {
    byA: {
      title: 'By A',
      documentation: '',
      parameters: {},
      examples: [],
      implementation: () => 'value'
    }
  }

  return docType
}

test('Accept recognised filter names.', () => {
  expect(() => ensureFilterName(createDocType(), 'byA')).not.toThrow()
})

test('Reject unrecognised filter names.', () => {
  try {
    ensureFilterName(createDocType(), 'byInvalid')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiUnrecognisedFilterNameError)
    expect(err.filterName).toEqual('byInvalid')
  }
})

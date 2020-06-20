/* eslint-env jest */
const { JsonotronCalculatedFieldFailedError } = require('jsonotron-errors')
const applyCalculatedFieldValuesToDocument = require('./applyCalculatedFieldValuesToDocument')

const docType = {
  name: 'test',
  calculatedFields: {
    combined: {
      inputFields: ['propA', 'propB'],
      value: input => input.propA + ' ' + input.propB
    },
    errorThrower: {
      inputFields: [],
      value: input => { throw new Error('problemo') }
    },
    noInputs: {
      value: input => 'fixed result'
    }
  }
}

test('Apply calculated values.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  applyCalculatedFieldValuesToDocument(docType, doc, ['combined'])
  expect(doc).toEqual({ propA: 'hello', propB: 'world', combined: 'hello world' })
})

test('Apply calculated values ignoring unrecognised field names.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  applyCalculatedFieldValuesToDocument(docType, doc, ['madeup'])
  expect(doc).toEqual({ propA: 'hello', propB: 'world' })
})

test('Apply calculated values where there are no input names.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  applyCalculatedFieldValuesToDocument(docType, doc, ['noInputs'])
  expect(doc).toEqual({ propA: 'hello', propB: 'world', noInputs: 'fixed result' })
})

test('Calculated fields that raise errors should be surfaced.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  expect(() => applyCalculatedFieldValuesToDocument(docType, doc, ['errorThrower'])).toThrow(JsonotronCalculatedFieldFailedError)
  expect(() => applyCalculatedFieldValuesToDocument(docType, doc, ['errorThrower'])).toThrow(/problemo/)
})

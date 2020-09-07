/* eslint-env jest */
import { SengiCalculatedFieldFailedError } from '../errors'
import { executeCalculatedField } from './executeCalculatedField'

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

test('Execute calculated field.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  expect(executeCalculatedField(docType, doc, 'combined')).toEqual('hello world')
})

test('Execute calculated field where there are no inputs.', () => {
  expect(executeCalculatedField(docType, {}, 'noInputs')).toEqual('fixed result')
})

test('Wrap calculated fields that throw errors.', () => {
  expect(() => executeCalculatedField(docType, {}, 'errorThrower')).toThrow(SengiCalculatedFieldFailedError)
  expect(() => executeCalculatedField(docType, {}, 'errorThrower')).toThrow(/problemo/)
})

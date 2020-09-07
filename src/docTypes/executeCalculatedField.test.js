/* eslint-env jest */
import {
  JsonotronCalculatedFieldFailedError,
  JsonotronUnrecognisedCalculatedFieldNameError
} from '../jsonotron-errors'
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

test('Fail to execute an invalid calculated field.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  expect(() => executeCalculatedField(docType, doc, 'invalid')).toThrow(JsonotronUnrecognisedCalculatedFieldNameError)
})

test('Execute calculated field where there are no inputs.', () => {
  expect(executeCalculatedField(docType, {}, 'noInputs')).toEqual('fixed result')
})

test('Wrap calculated fields that throw errors.', () => {
  expect(() => executeCalculatedField(docType, {}, 'errorThrower')).toThrow(JsonotronCalculatedFieldFailedError)
  expect(() => executeCalculatedField(docType, {}, 'errorThrower')).toThrow(/problemo/)
})

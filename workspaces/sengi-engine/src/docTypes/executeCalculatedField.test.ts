import { expect, test } from '@jest/globals'
import { DocType, SengiCalculatedFieldFailedError } from 'sengi-interfaces'
import { executeCalculatedField } from './executeCalculatedField'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.calculatedFields.combined = {
    type: 'string',
    inputFields: ['propA', 'propB'],
    value: input => input.propA + ' ' + input.propB,
    documentation: ''
  }

  docType.calculatedFields.errorThrower = {
    type: 'string',
    inputFields: [],
    value: () => { throw new Error('problemo') },
    documentation: ''
  }

  docType.calculatedFields.noInputs = {
    type: 'string',
    inputFields: [],
    value: () => 'fixed result',
    documentation: ''
  }

  return docType
}

test('Execute calculated field.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  expect(executeCalculatedField(createDocType(), doc, 'combined')).toEqual('hello world')
})

test('Execute calculated field where there are no inputs.', () => {
  expect(executeCalculatedField(createDocType(), {}, 'noInputs')).toEqual('fixed result')
})

test('Wrap calculated fields that throw errors.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  try {
    executeCalculatedField(createDocType(), doc, 'errorThrower')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiCalculatedFieldFailedError)
    expect(err.message).toMatch(/problemo/)
  }
})

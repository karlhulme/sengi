/* eslint-env jest */
import { JsonotronInvalidMergePatchError } from '../jsonotron-errors'
import { createMergePatchForUpdateableFields } from './createMergePatchForUpdateableFields'

const docType = {
  fields: {
    propA: { canUpdate: true },
    propB: {},
    propC: { canUpdate: true }
  },
  calculatedFields: {
    calcD: {}
  }
}

test('Accept patches that reference updateable fields.', () => {
  expect(createMergePatchForUpdateableFields(docType, { propA: 'hello', propC: 123, propE: 'extra' })).toEqual({ propA: 'hello', propC: 123 })
})

test('Reject patches that reference non-updatable fields.', () => {
  expect(() => createMergePatchForUpdateableFields(docType, { propA: 'hello', propB: 'bad' })).toThrow(JsonotronInvalidMergePatchError)
  expect(() => createMergePatchForUpdateableFields(docType, { propA: 'hello', propB: 'bad' })).toThrow(/Cannot reference a non-updateable field 'propB'/)
})

test('Reject patches that reference calculated fields.', () => {
  expect(() => createMergePatchForUpdateableFields(docType, { propA: 'hello', calcD: 'bad' })).toThrow(JsonotronInvalidMergePatchError)
  expect(() => createMergePatchForUpdateableFields(docType, { propA: 'hello', calcD: 'bad' })).toThrow(/Cannot reference a calculated field 'calcD'/)
})

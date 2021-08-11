import { expect, test } from '@jest/globals'
import { AnyDocType } from 'sengi-interfaces'
import { ensureDocTypeCommonFields } from './ensureDocTypeCommonFields'

test('A doc type that is missing the key fields will be patched.', () => {
  const docType = { name: 'test', pluralName: 'tests', jsonSchema: { type: 'object', properties: {} } }
  ensureDocTypeCommonFields(docType)
  expect(docType.jsonSchema.properties).toHaveProperty('id')
  expect(docType.jsonSchema.properties).toHaveProperty('docType')
  expect(docType.jsonSchema.properties).toHaveProperty('docOpIds')
  expect(docType.jsonSchema.properties).toHaveProperty('docVersion')
})

test('A doc type that has the key fields will not be patched.', () => {
  const docType = { name: 'test', pluralName: 'tests', jsonSchema: { id: {}, docType: {}, docOpIds: {}, docVersion: {} } }
  ensureDocTypeCommonFields(docType)
  expect(docType.jsonSchema.id).toEqual({})
  expect(docType.jsonSchema.docType).toEqual({})
  expect(docType.jsonSchema.docOpIds).toEqual({})
  expect(docType.jsonSchema.docVersion).toEqual({})
})

test('A doc type that is missing a json schema will be ignored.', () => {
  const docType = { name: 'test', pluralName: 'tests' } as unknown as AnyDocType
  ensureDocTypeCommonFields(docType)
  expect(docType.jsonSchema).not.toBeDefined()
})

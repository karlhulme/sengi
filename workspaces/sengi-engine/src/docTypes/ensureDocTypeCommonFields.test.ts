import { expect, test } from '@jest/globals'
import { AnyDocType } from 'sengi-interfaces'
import { ensureDocTypeCommonFields } from './ensureDocTypeCommonFields'

test('A doc type that is missing the key fields will be patched.', () => {
  const docType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {
      type: 'object',
      properties: {}
    }
  }

  ensureDocTypeCommonFields(docType)

  expect(docType.jsonSchema.properties).toHaveProperty('id')
  expect(docType.jsonSchema.properties).toHaveProperty('docType')
  expect(docType.jsonSchema.properties).toHaveProperty('docOpIds')
  expect(docType.jsonSchema.properties).toHaveProperty('docVersion')
  expect(docType.jsonSchema.properties).toHaveProperty('docCreatedMillisecondsSinceEpoch')
  expect(docType.jsonSchema.properties).toHaveProperty('docCreatedByUserId')
  expect(docType.jsonSchema.properties).toHaveProperty('docLastUpdatedMillisecondsSinceEpoch')
  expect(docType.jsonSchema.properties).toHaveProperty('docLastUpdatedByUserId')
})

test('A doc type that has the key fields will not be patched.', () => {
  const docType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {
      type: 'object',
      properties: {
        id: {},
        docType: {},
        docOpIds: {},
        docVersion: {},
        docCreatedMillisecondsSinceEpoch: {},
        docCreatedByUserId: {},
        docLastUpdatedMillisecondsSinceEpoch: {},
        docLastUpdatedByUserId: {}
      }
    }
  }

  ensureDocTypeCommonFields(docType)

  expect(docType.jsonSchema.properties.id).toEqual({})
  expect(docType.jsonSchema.properties.docType).toEqual({})
  expect(docType.jsonSchema.properties.docOpIds).toEqual({})
  expect(docType.jsonSchema.properties.docVersion).toEqual({})
  expect(docType.jsonSchema.properties.docCreatedMillisecondsSinceEpoch).toEqual({})
  expect(docType.jsonSchema.properties.docCreatedByUserId).toEqual({})
  expect(docType.jsonSchema.properties.docLastUpdatedMillisecondsSinceEpoch).toEqual({})
  expect(docType.jsonSchema.properties.docLastUpdatedByUserId).toEqual({})
})

test('A doc type that is missing a json schema will be ignored.', () => {
  const docType = { name: 'test', pluralName: 'tests' } as unknown as AnyDocType
  ensureDocTypeCommonFields(docType)
  expect(docType.jsonSchema).not.toBeDefined()
})

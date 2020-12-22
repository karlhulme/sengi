import { test, expect } from '@jest/globals'
import { createRestResourceMatcherArray } from './createRestResourceMatcherArray'
import { matchPathToRestResource } from './matchPathToRestResource'
import { RestResourceType } from '../enums'

test('Find no match where there is no path match for zero additional components.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('unknown', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unknown/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unkno:wn/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/enumtypes', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/enum-types/foo/bar', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/films/123/addReview/morepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/films/123/addReview/morepaths/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/films/123/addReview/morepaths/evenmorepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find no match where there is no path match with 1 additional component.', () => {
  const pathMatchArray = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('unknown/orgA', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/org:A//', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/tenantA/films/123:addReview/morepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find no match where there is no path match for 2 additional components.', () => {
  const pathMatchArray = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('unknown/orgA/tenantA', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/org:A/films/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/docs/orgA/tenantA/films/123:addReview/morepaths/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find the global root.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('', pathMatchArray)).toEqual({ type: RestResourceType.GLOBAL_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/', pathMatchArray)).toEqual({ type: RestResourceType.GLOBAL_ROOT, urlParams: {} })
})

test('Find documents root.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('docs', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENTS_ROOT, urlParams: {} })
  expect(matchPathToRestResource('docs/', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENTS_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/docs', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENTS_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/docs/', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENTS_ROOT, urlParams: {} })
})

test('Find documents collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/docs/films', pathMatchArray)).toEqual({ type: RestResourceType.COLLECTION, urlParams: { adc: '', docTypePluralName: 'films' } })
  expect(matchPathToRestResource('/docs/films/', pathMatchArray)).toEqual({ type: RestResourceType.COLLECTION, urlParams: { adc: '', docTypePluralName: 'films' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/docs/tenantA/films', pathMatchArray1)).toEqual({ type: RestResourceType.COLLECTION, urlParams: { adc: '/tenantA', docTypePluralName: 'films' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/docs/orgA/tenantA/films/', pathMatchArray2)).toEqual({ type: RestResourceType.COLLECTION, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films' } })
})

test('Find a specific document within a collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/docs/films/123', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENT, urlParams: { adc: '', docTypePluralName: 'films', id: '123' } })
  expect(matchPathToRestResource('/docs/films/123/', pathMatchArray)).toEqual({ type: RestResourceType.DOCUMENT, urlParams: { adc: '', docTypePluralName: 'films', id: '123' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/docs/tenantA/films/12-3456', pathMatchArray1)).toEqual({ type: RestResourceType.DOCUMENT, urlParams: { adc: '/tenantA', docTypePluralName: 'films', id: '12-3456' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/docs/orgA/tenantA/films/123/', pathMatchArray2)).toEqual({ type: RestResourceType.DOCUMENT, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films', id: '123' } })
})

test('Find a specific document and operation name method within a collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/docs/films/123:addReview', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })
  expect(matchPathToRestResource('/docs/films/123:addReview/', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/docs/tenantA/films/123:addReview', pathMatchArray1)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/tenantA', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/docs/orgA/tenantA/films/123:addReview/', pathMatchArray2)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })
})

test('decode enum types root', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/schemas/enum-types', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/enum-types/', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/enum-types', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/enum-types/', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPES_ROOT, urlParams: {} })
})

test('decode enum type', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/schemas/enum-types/foo', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPE, urlParams: { enumTypeName: 'foo' } })
  expect(matchPathToRestResource('/schemas/enum-types/foo/', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPE, urlParams: { enumTypeName: 'foo' } })
  expect(matchPathToRestResource('/schemas/enum-types/fooType', pathMatchArray)).toEqual({ type: RestResourceType.ENUM_TYPE, urlParams: { enumTypeName: 'fooType' } })
})

test('decode schema types root', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/schemas/schema-types', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/schema-types/', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/schema-types', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPES_ROOT, urlParams: {} })
  expect(matchPathToRestResource('/schemas/schema-types/', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPES_ROOT, urlParams: {} })
})

test('decode schema type', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/schemas/schema-types/foo', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPE, urlParams: { schemaTypeName: 'foo' } })
  expect(matchPathToRestResource('/schemas/schema-types/foo/', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPE, urlParams: { schemaTypeName: 'foo' } })
  expect(matchPathToRestResource('/schemas/schema-types/fooType', pathMatchArray)).toEqual({ type: RestResourceType.SCHEMA_TYPE, urlParams: { schemaTypeName: 'fooType' } })
})

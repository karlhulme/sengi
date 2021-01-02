import { test, expect } from '@jest/globals'
import { createRestResourceMatcherArray } from './createRestResourceMatcherArray'
import { matchPathToRestResource } from './matchPathToRestResource'
import { RestResourceType } from '../enums'

test('Find no match where there is no path match for zero additional components.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('unknown', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unknown/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unkno:wn/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/enum-types/foo/bar', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/records/films/123/addReview/morepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/records/films/123/addReview/morepaths/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/records/films/123/addReview/morepaths/evenmorepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find no match where there is no path match with 1 additional component.', () => {
  const pathMatchArray = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('unknown/orgA', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/org:A//', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/records/tenantA/films/123:addReview/morepaths', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find no match where there is no path match for 2 additional components.', () => {
  const pathMatchArray = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('unknown/orgA/tenantA', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/org:A/films/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('/records/orgA/tenantA/films/123:addReview/morepaths/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
})

test('Find the root.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('', pathMatchArray)).toEqual({ type: RestResourceType.ROOT, urlParams: {} })
  expect(matchPathToRestResource('/', pathMatchArray)).toEqual({ type: RestResourceType.ROOT, urlParams: {} })
})

test('Find records collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypePluralName: 'films' } })
  expect(matchPathToRestResource('/records/films/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypePluralName: 'films' } })
  expect(matchPathToRestResource('/records/namespace.films/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypePluralName: 'namespace.films' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/tenantA/records/films', pathMatchArray1)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '/tenantA', docTypePluralName: 'films' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/orgA/tenantA/records/films/', pathMatchArray2)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films' } })
})

test('Find a specific record within a collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films/123', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypePluralName: 'films', id: '123' } })
  expect(matchPathToRestResource('/records/films/123/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypePluralName: 'films', id: '123' } })
  expect(matchPathToRestResource('/records/namespace.films/123/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypePluralName: 'namespace.films', id: '123' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/tenantA/records/films/12-3456', pathMatchArray1)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '/tenantA', docTypePluralName: 'films', id: '12-3456' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/orgA/tenantA/records/films/123/', pathMatchArray2)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films', id: '123' } })
})

test('Find a specific document and operation name method within a collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films/123:addReview', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })
  expect(matchPathToRestResource('/records/films/123:addReview/', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })
  expect(matchPathToRestResource('/records/namespace.films/123:addReview/', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypePluralName: 'namespace.films', id: '123', operationName: 'addReview' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/tenantA/records/films/123:addReview', pathMatchArray1)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/tenantA', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/orgA/tenantA/records/films/123:addReview/', pathMatchArray2)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/orgA/tenantA', docTypePluralName: 'films', id: '123', operationName: 'addReview' } })
})

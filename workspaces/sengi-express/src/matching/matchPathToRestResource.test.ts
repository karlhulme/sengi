import { test, expect } from '@jest/globals'
import { createRestResourceMatcherArray } from './createRestResourceMatcherArray'
import { matchPathToRestResource } from './matchPathToRestResource'
import { RestResourceType } from '../enums'

test('Find no match where there is no path match for zero additional components.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('unknown', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unknown/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
  expect(matchPathToRestResource('unkno:wn/', pathMatchArray)).toEqual({ type: RestResourceType.NO_MATCH, urlParams: {} })
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

test('Find a record collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypeSingularOrPluralName: 'films' } })
  expect(matchPathToRestResource('/records/films/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypeSingularOrPluralName: 'films' } })
  expect(matchPathToRestResource('/records/namespace.films/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '', docTypeSingularOrPluralName: 'namespace.films' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/records/tenantA/films', pathMatchArray1)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '/tenantA', docTypeSingularOrPluralName: 'films' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/records/orgA/tenantA/films/', pathMatchArray2)).toEqual({ type: RestResourceType.RECORD_COLLECTION, urlParams: { adc: '/orgA/tenantA', docTypeSingularOrPluralName: 'films' } })
})

test('Find a constructor on a record collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films:makeFilm', pathMatchArray)).toEqual({ type: RestResourceType.CONSTRUCTOR, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', constructorName: 'makeFilm' } })
  expect(matchPathToRestResource('/records/films:makeFilm/', pathMatchArray)).toEqual({ type: RestResourceType.CONSTRUCTOR, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', constructorName: 'makeFilm' } })
  expect(matchPathToRestResource('/records/namespace.films:makeFilm/', pathMatchArray)).toEqual({ type: RestResourceType.CONSTRUCTOR, urlParams: { adc: '', docTypeSingularOrPluralName: 'namespace.films', constructorName: 'makeFilm' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/records/tenantA/films:makeFilm', pathMatchArray1)).toEqual({ type: RestResourceType.CONSTRUCTOR, urlParams: { adc: '/tenantA', docTypeSingularOrPluralName: 'films', constructorName: 'makeFilm' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/records/orgA/tenantA/films:makeFilm/', pathMatchArray2)).toEqual({ type: RestResourceType.CONSTRUCTOR, urlParams: { adc: '/orgA/tenantA', docTypeSingularOrPluralName: 'films', constructorName: 'makeFilm' } })
})

test('Find a specific record within a collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films/123', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', id: '123' } })
  expect(matchPathToRestResource('/records/films/123/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', id: '123' } })
  expect(matchPathToRestResource('/records/namespace.films/123/', pathMatchArray)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '', docTypeSingularOrPluralName: 'namespace.films', id: '123' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/records/tenantA/films/12-3456', pathMatchArray1)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '/tenantA', docTypeSingularOrPluralName: 'films', id: '12-3456' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/records/orgA/tenantA/films/123/', pathMatchArray2)).toEqual({ type: RestResourceType.RECORD, urlParams: { adc: '/orgA/tenantA', docTypeSingularOrPluralName: 'films', id: '123' } })
})

test('Find a specific record and operation name method within a record collection.', () => {
  const pathMatchArray = createRestResourceMatcherArray(0)
  expect(matchPathToRestResource('/records/films/123:addReview', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', id: '123', operationName: 'addReview' } })
  expect(matchPathToRestResource('/records/films/123:addReview/', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypeSingularOrPluralName: 'films', id: '123', operationName: 'addReview' } })
  expect(matchPathToRestResource('/records/namespace.films/123:addReview/', pathMatchArray)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '', docTypeSingularOrPluralName: 'namespace.films', id: '123', operationName: 'addReview' } })

  const pathMatchArray1 = createRestResourceMatcherArray(1)
  expect(matchPathToRestResource('/records/tenantA/films/123:addReview', pathMatchArray1)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/tenantA', docTypeSingularOrPluralName: 'films', id: '123', operationName: 'addReview' } })

  const pathMatchArray2 = createRestResourceMatcherArray(2)
  expect(matchPathToRestResource('/records/orgA/tenantA/films/123:addReview/', pathMatchArray2)).toEqual({ type: RestResourceType.OPERATION, urlParams: { adc: '/orgA/tenantA', docTypeSingularOrPluralName: 'films', id: '123', operationName: 'addReview' } })
})

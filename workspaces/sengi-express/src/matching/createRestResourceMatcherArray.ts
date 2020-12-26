import { RestResourceType } from '../enums'
import { RestResourceMatcher } from './RestResourceMatcher'

/**
 * Returns an array of rest resource matchers.
 * @param adc The number of additional components to be expected in the path
 * between docs and the doc type plural name.
 */
export function createRestResourceMatcherArray (adc: number): RestResourceMatcher[] {
  return [
    { type: RestResourceType.ROOT, expr: /^\/?$/ },
    { type: RestResourceType.COLLECTION, expr: new RegExp(`^(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/?$`) },
    { type: RestResourceType.DOCUMENT, expr: new RegExp(`^(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/(?<id>[a-zA-Z0-9_-]+)/?$`) },
    { type: RestResourceType.OPERATION, expr: new RegExp(`^(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/(?<id>[a-zA-Z0-9_-]+):(?<operationName>[a-zA-Z0-9_]+)/?$`) }
  ]
}

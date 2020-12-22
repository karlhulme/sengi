import { RestResourceType } from '../enums'
import { RestResourceMatcher } from './RestResourceMatcher'

/**
 * Returns an array of rest resource matchers.
 * @param adc The number of additional components to be expected in the path
 * between docs and the doc type plural name.
 */
export function createRestResourceMatcherArray (adc: number): RestResourceMatcher[] {
  return [
    // global root
    { type: RestResourceType.GLOBAL_ROOT, expr: /^\/?$/ },

    // schemas
    { type: RestResourceType.SCHEMAS_ROOT, expr: /^\/?schemas\/?$/ },
    { type: RestResourceType.ENUM_TYPES_ROOT, expr: /^\/?schemas\/enum-types\/?$/ },
    { type: RestResourceType.SCHEMA_TYPES_ROOT, expr: /^\/?schemas\/schema-types\/?$/ },
    { type: RestResourceType.DOC_TYPES_ROOT, expr: /^\/?schemas\/doc-types\/?$/ },
    { type: RestResourceType.ENUM_TYPE, expr: /^\/?schemas\/enum-types\/(?<enumTypeName>[a-zA-Z0-9_]+)\/?$/ },
    { type: RestResourceType.SCHEMA_TYPE, expr: /^\/?schemas\/schema-types\/(?<schemaTypeName>[a-zA-Z0-9_]+)\/?$/ },
    { type: RestResourceType.DOC_TYPE, expr: /^\/?schemas\/doc-types\/(?<docTypeName>[a-zA-Z0-9_]+)\/?$/ },

    // documents
    { type: RestResourceType.DOCUMENTS_ROOT, expr: /^\/?docs\/?$/ },
    { type: RestResourceType.COLLECTION, expr: new RegExp(`^/?docs(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/?$`) },
    { type: RestResourceType.DOCUMENT, expr: new RegExp(`^/?docs(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/(?<id>[a-zA-Z0-9_-]+)/?$`) },
    { type: RestResourceType.OPERATION, expr: new RegExp(`^/?docs(?<adc>(/[a-zA-Z0-9_]+){${adc}})/(?<docTypePluralName>[a-zA-Z0-9_]+)/(?<id>[a-zA-Z0-9_-]+):(?<operationName>[a-zA-Z0-9_]+)/?$`) }
  ]
}

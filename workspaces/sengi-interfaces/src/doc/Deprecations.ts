import { DeprecationNotice } from './DeprecationNotice'

/**
 * Represents an object that contains one key for each deprecated field.
 */
export type Deprecations = Record<string, DeprecationNotice>

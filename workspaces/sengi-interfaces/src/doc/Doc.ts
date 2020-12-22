import { DocStoredField } from './DocStoredField'

/**
 * Represents a document managed by the Sengi system.
 */
export type Doc = Record<string, DocStoredField>

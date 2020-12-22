import { DocPatchField } from './DocPatchField'

/**
 * Represents a document patch, which can contain null as the value
 * part of the record.
 */
export type DocPatch = Record<string, DocPatchField>

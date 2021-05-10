import { DocPatchField } from './DocPatchField'

/**
 * Represents a patch to be applied to a document.
 */
export type DocPatch = Record<string, DocPatchField>

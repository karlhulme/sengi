/**
 * Represents a field on a patch which can be any of the
 * usual types as well as null, which means delete.
 */
export type DocPatchField = null|string|number|boolean|Array<unknown>|Record<string, unknown>

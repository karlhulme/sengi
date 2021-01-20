import { DocPatch, DocSystemFieldNames, SengiInvalidOperationPatchError } from 'sengi-interfaces'

/**
 * Raises an error if the given patch references
 * any of the system fields.
 * @param docTypeName The name of a doc type.
 * @param operationName The name of the operation that generated the patch.
 * @param patch A patch object.
 */
export function ensureOperationPatchAvoidsSystemFields (docTypeName: string, operationName: string, patch: DocPatch): void {
  for (const patchKey in patch) {
    if (DocSystemFieldNames.includes(patchKey)) {
      throw new SengiInvalidOperationPatchError(docTypeName, operationName, `Cannot reference a system field '${patchKey}'.`)
    }
  }
}

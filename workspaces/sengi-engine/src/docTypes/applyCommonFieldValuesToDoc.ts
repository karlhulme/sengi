import { DocRecord } from 'sengi-interfaces'

/**
 * Sets the created and updated fields on the given document.
 * @param doc A document.
 * @param millisecondsSinceEpoch The number of milliseconds since the Unix epoch.
 * @param userId The id of a user.
 */
export function applyCommonFieldValuesToDoc (doc: DocRecord, millisecondsSinceEpoch: number, userId: string): void {
  if (!doc.docCreatedMillisecondsSinceEpoch) {
    doc.docCreatedMillisecondsSinceEpoch = millisecondsSinceEpoch
  }

  if (!doc.docCreatedByUserId) {
    doc.docCreatedByUserId = userId
  }

  doc.docLastUpdatedMillisecondsSinceEpoch = millisecondsSinceEpoch
  doc.docLastUpdatedByUserId = userId
}

import check from 'check-types'

/**
 * Applies the docHeader property to the document, appending
 * any sections that are missing using the given user identity
 * and date time.
 * @param {Object} doc A document.
 * @param {String} userIdentity The identity of a user.
 * @param {String} dateTime A value that indicates when the
 * document is being treated.  This value is used where required date/time
 * values in the docHeader are missing.
 */
export const applyDocHeaderToDocument = (doc, userIdentity, dateTime) => {
  check.assert.object(doc)
  check.assert.string(userIdentity)
  check.assert.string(dateTime)

  /* docHeader */

  if (typeof doc.docHeader !== 'object' || doc.docHeader === null || Array.isArray(doc.docHeader)) {
    doc.docHeader = {}
  }

  /* docHeader.origin */

  if (typeof doc.docHeader.origin !== 'object' || doc.docHeader.origin === null || Array.isArray(doc.docHeader.origin)) {
    doc.docHeader.origin = {}
  }

  if (typeof doc.docHeader.origin.userIdentity !== 'string') {
    doc.docHeader.origin.userIdentity = userIdentity
  }

  if (typeof doc.docHeader.origin.dateTime !== 'string') {
    doc.docHeader.origin.dateTime = dateTime
  }

  /* docHeader.updated */

  if (typeof doc.docHeader.updated !== 'object' || doc.docHeader.updated === null || Array.isArray(doc.docHeader.updated)) {
    doc.docHeader.updated = {}
  }

  if (typeof doc.docHeader.updated.userIdentity !== 'string') {
    doc.docHeader.updated.userIdentity = userIdentity
  }

  if (typeof doc.docHeader.updated.dateTime !== 'string') {
    doc.docHeader.updated.dateTime = dateTime
  }

  /* docHeader.ops */

  if (!Array.isArray(doc.docHeader.ops)) {
    doc.docHeader.ops = []
  }

  for (let i = doc.docHeader.ops.length - 1; i >= 0; i--) {
    const candidateOp = doc.docHeader.ops[i]

    const isCandidateOpValid =
      (typeof candidateOp === 'object' && candidateOp !== null && !Array.isArray(candidateOp)) &&
      typeof candidateOp.opId === 'string' &&
      typeof candidateOp.userIdentity === 'string' &&
      typeof candidateOp.dateTime === 'string' &&
      typeof candidateOp.style === 'string'

    if (!isCandidateOpValid) {
      doc.docHeader.ops.splice(i, 1)
    }
  }

  /* docHeader.calcs */

  if (typeof doc.docHeader.calcs !== 'object' || Array.isArray(doc.docHeader.calcs) || doc.docHeader.calcs === null) {
    doc.docHeader.calcs = {}
  }
}

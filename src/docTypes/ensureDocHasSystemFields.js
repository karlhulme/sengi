const check = require('check-types')
const { JsonotronInternalError } = require('jsonotron-errors')

/**
 * Raises an error if the given document is missing an id or a docType.
 * If the document does not have a sys.ops property it will be added.
 * If the document does not have a sys.calcs property it will be added.
 * Note that a docVersion is not a required property and sys.origin will
 * not be created.
 * @param {Object} doc A document.
 */
const ensureDocHasSystemFields = doc => {
  check.assert.object(doc)

  if (!doc.id) {
    throw new JsonotronInternalError('Document is missing system property \'id\'.')
  }

  if (!doc.docType) {
    throw new JsonotronInternalError('Document is missing system property \'docType\'.')
  }

  if (typeof doc.sys !== 'object' || doc.sys === null || Array.isArray(doc.sys)) {
    doc.sys = {}
  }

  if (!Array.isArray(doc.sys.ops)) {
    doc.sys.ops = []
  }

  for (let i = doc.sys.ops.length - 1; i >= 0; i--) {
    const candidateOp = doc.sys.ops[i]

    const isCandidateOpValid =
      (typeof candidateOp === 'object' && candidateOp !== null && !Array.isArray(candidateOp)) &&
      typeof candidateOp.opId === 'string' &&
      typeof candidateOp.userIdentity === 'string' &&
      typeof candidateOp.dateTime === 'string' &&
      typeof candidateOp.style === 'string'

    if (!isCandidateOpValid) {
      doc.sys.ops.splice(i, 1)
    }
  }

  if (typeof doc.sys.calcs !== 'object' || Array.isArray(doc.sys.calcs) || doc.sys.calcs === null) {
    doc.sys.calcs = {}
  }
}

module.exports = ensureDocHasSystemFields

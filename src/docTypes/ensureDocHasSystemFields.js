const check = require('check-types')
const { JsonotronInternalError } = require('../errors')

/**
 * Raises an error if the given document is missing an id or a docType.
 * If the document does not have a docOps property it will be added.
 * If the document does not have a docCalcs property it will be added.
 * Note that a docVersion is not a required property.
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

  if (!Array.isArray(doc.docOps)) {
    doc.docOps = []
  }

  if (typeof doc.docCalcs !== 'object' || Array.isArray(doc.docCalcs) || doc.docCalcs === null) {
    doc.docCalcs = {}
  }
}

module.exports = ensureDocHasSystemFields

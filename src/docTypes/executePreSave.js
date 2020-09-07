import check from 'check-types'
import { JsonotronPreSaveFailedError } from '../jsonotron-errors'

/**
 * Execute a doc type pre-save function.
 * @param {Object} docType A doc type.
 * @param {Object} doc A document that may be amended by the function.
 */
export const executePreSave = (docType, doc) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(doc)

  if (typeof docType.preSave === 'function') {
    try {
      docType.preSave(doc)
    } catch (err) {
      throw new JsonotronPreSaveFailedError(docType.name, err)
    }
  }
}

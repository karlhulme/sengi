import check from 'check-types'
import { SengiConstructorFailedError } from '../errors'

/**
 * Execute a doc type constructor.
 * @param {Object} docType A doc type.
 * @param {Object} constructorParams A parameter object to be passed to the constructor.
 */
export const executeConstructor = (docType, constructorParams) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.object(docType.ctor)
  check.assert.function(docType.ctor.implementation)
  check.assert.maybe.object(constructorParams)

  try {
    return docType.ctor.implementation(constructorParams)
  } catch (err) {
    throw new SengiConstructorFailedError(docType.name, err)
  }
}

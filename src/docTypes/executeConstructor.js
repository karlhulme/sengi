import check from 'check-types'
import {
  JsonotronConstructorFailedError,
  JsonotronConstructorNotDefinedError
} from '../jsonotron-errors'

/**
 * Execute a doc type constructor.
 * @param {Object} docType A doc type.
 * @param {Object} constructorParams A parameter object to be passed to the constructor.
 */
export const executeConstructor = (docType, constructorParams) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.maybe.object(constructorParams)

  const ctorFunc = (docType.ctor || {}).implementation

  if (typeof ctorFunc !== 'function') {
    throw new JsonotronConstructorNotDefinedError(docType.name)
  }

  try {
    return ctorFunc(constructorParams)
  } catch (err) {
    throw new JsonotronConstructorFailedError(docType.name, err)
  }
}

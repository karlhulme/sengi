const check = require('check-types')
const {
  JsonotronConstructorFailedError,
  JsonotronConstructorNotDefinedError
} = require('../errors')

/**
 * Execute a doc type constructor.
 * @param {Object} docType A doc type.
 * @param {Object} constructorParams A parameter object to be passed to the constructor.
 */
const executeConstructor = (docType, constructorParams) => {
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

module.exports = executeConstructor

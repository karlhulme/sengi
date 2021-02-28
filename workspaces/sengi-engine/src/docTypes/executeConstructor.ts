import {
  Doc, DocFragment, DocType,
  DocTypeConstructorImplementation,
  SengiConstructorFailedError,
  SengiConstructorNonObjectResponseError
} from 'sengi-interfaces'

/**
 * Call constructor implementation and wrap any errors raised.
 * @param docTypeName The name of the doc type.
 * @param implementation The function to be invoked.
 * @param constructorParams The constructor parameters.
 * @param mergeParams The fields passed to the constructor.
 */
export function callConstructorImplementation (docTypeName: string, implementation: DocTypeConstructorImplementation, constructorParams: DocFragment, mergeParams: DocFragment): unknown {
  try {
    return implementation(constructorParams, mergeParams)
  } catch (err) {
    throw new SengiConstructorFailedError(docTypeName, err)
  }
}

/**
 * Execute a doc type constructor.
 * @param docType A doc type.
 * @param constructorParams The constructor parameters.
 * @param mergeParams A fields defined on the document that were also passed
 * to the constructor so that they can be merged into the final document.
 */
export function executeConstructor (docType: DocType, constructorParams: DocFragment, mergeParams: DocFragment): Doc {
  const result = callConstructorImplementation(docType.name, docType.ctor.implementation, constructorParams, mergeParams)

  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new SengiConstructorNonObjectResponseError(docType.name)
  }

  return result as Doc
}

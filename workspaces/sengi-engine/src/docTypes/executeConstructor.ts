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
 * @param constructorParams The parameters of the constructor.
 */
export function callConstructorImplementation (docTypeName: string, implementation: DocTypeConstructorImplementation, constructorParams: DocFragment): unknown {
  try {
    return implementation(constructorParams)
  } catch (err) {
    throw new SengiConstructorFailedError(docTypeName, err)
  }
}

/**
 * Execute a doc type constructor.
 * @param docType A doc type.
 * @param constructorParams A parameter object to be passed to the constructor.
 */
export function executeConstructor (docType: DocType, constructorParams: DocFragment): Doc {
  const result = callConstructorImplementation(docType.name, docType.ctor.implementation, constructorParams)

  if (typeof result !== 'object' || result === null || Array.isArray(result)) {
    throw new SengiConstructorNonObjectResponseError(docType.name)
  }

  return result as Doc
}

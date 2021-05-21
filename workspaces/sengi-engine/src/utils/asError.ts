/**
 * Forcibly converts the object to an Error type which works around a bug
 * where Typescript does not recognise custom errors.
 * @param errType Any error type.
 */
 export function asError (errType: unknown): Error {
  return errType as Error
}

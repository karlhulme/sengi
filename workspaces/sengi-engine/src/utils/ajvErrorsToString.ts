import { ErrorObject } from 'ajv'

/*
 * Convert validator errors to a string.
 * @param errors An array of error objects.
 */
export function ajvErrorsToString (errors?: ErrorObject[]|null): string {
 return JSON.stringify(errors, null, 2)
}

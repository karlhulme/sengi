import Ajv, { AnySchema } from 'ajv'
import { ajvErrorsToString } from '../utils'
import { SengiUserValidationFailedError } from 'sengi-interfaces'

/**
 * Ensures the user object conforms to the given schema.
 * @param ajv A json validator.
 * @param userSchema A schema for the user object.
 * @param user: A user object.
 */
export function ensureUser<User> (ajv: Ajv, userSchema: AnySchema, user: unknown): User {
  if (!ajv.validate(userSchema, user)) {
    throw new SengiUserValidationFailedError(ajvErrorsToString(ajv.errors))
  }

  return user as User
}

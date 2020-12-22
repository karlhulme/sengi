import { SengiExpressMissingRoleNamesError } from '../errors'
import { csvStringToArray } from '../utils'

/**
 * Raises an error if the given role names can not be converted
 * to a role names array
 * @param roleNames An array of rolenames or a string of role names
 * separated by a comma.
 */
export function ensureHeaderRoleNames (roleNames?: string|string[]): string[] {
  if (typeof roleNames === 'undefined') {
    throw new SengiExpressMissingRoleNamesError()
  } else if (Array.isArray(roleNames)) {
    throw new SengiExpressMissingRoleNamesError()
  } else {
    const result = csvStringToArray(roleNames)

    if (result.length === 0) {
      throw new SengiExpressMissingRoleNamesError()
    } else {
      return result
    }
  }
}

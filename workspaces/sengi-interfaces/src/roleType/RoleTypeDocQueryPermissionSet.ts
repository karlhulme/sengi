/**
 * Defines a set of queryable fields. 
 */
export interface RoleTypeDocQueryPermissionSet {
  /**
   * Specifies if the listed fields are the only fields that can be 
   * queried (i.e. include) or whether the client can query for
   * all fields except those listed (i.e. exclude).
   */
  fieldsTreatment: 'include'|'exclude'

  /**
   * A list of field names.
   */
  fields: string[]

  /**
   * A list of the commands that a client may invoke.
   */
  commands?: string[]
}

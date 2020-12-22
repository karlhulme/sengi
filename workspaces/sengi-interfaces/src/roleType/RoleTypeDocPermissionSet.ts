import { RoleTypeDocQueryPermissionSet } from './RoleTypeDocQueryPermissionSet'
import { RoleTypeDocUpdatePermissionSet } from './RoleTypeDocUpdatePermissionSet'

export interface RoleTypeDocPermissionSet {
  query?: boolean|RoleTypeDocQueryPermissionSet
  update?: boolean|RoleTypeDocUpdatePermissionSet
  create?: boolean
  delete?: boolean
  replace?: boolean
}

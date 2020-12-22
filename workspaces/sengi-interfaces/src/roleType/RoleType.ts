import { RoleTypeDocPermissionSet } from './RoleTypeDocPermissionSet'

export interface RoleType {
  name: string
  title: string
  documentation: string
  docPermissions: boolean|Record<string, boolean|RoleTypeDocPermissionSet>
}

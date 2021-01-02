import { RoleType } from 'sengi-interfaces';

export const admin: RoleType = {
  name: 'admin',
  title: 'Admin',
  documentation: '',
  docPermissions: {
    'ns.hobby': true
  }
}

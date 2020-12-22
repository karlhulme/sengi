import { RoleType } from 'sengi-interfaces';

export const admin: RoleType = {
  name: 'admin',
  title: 'Admin',
  documentation: '',
  docPermissions: {
    person: {
      query: {
        fieldsTreatment: 'whitelist',
        fields: [
          'id', 'shortName', 'fullName', 'dateOfBirth', 'addressLines',
          'postCode', 'favouriteColors', 'allowMarketing', 'fullAddress', 'age'
        ]
      },
      update: { patch: true, operations: ['replaceFavouriteColors', 'attemptToChangeId'] },
      create: true,
      delete: true,
      replace: true
    },
    car: true
  }
}

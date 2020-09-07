/* istanbul ignore file */

export const person = {
  name: 'person',
  pluralName: 'persons',
  title: 'Person',
  pluralTitle: 'Persons',
  policy: {
    canFetchWholeCollection: true,
    canReplaceDocuments: true,
    canDeleteDocuments: true,
    maxOpsSize: 5
  },
  fields: {
    tenantId: { type: 'shortString', isRequired: true },
    shortName: { type: 'shortString', isRequired: true, canUpdate: true },
    fullName: { type: 'mediumString', isRequired: true, canUpdate: true },
    dateOfBirth: { type: 'date', canUpdate: true },
    addressLines: { type: 'longString', canUpdate: true },
    postCode: { type: 'shortString', canUpdate: true },
    pinCode: { type: 'positiveInteger' },
    favouriteColors: { type: 'shortString', isArray: true },
    allowMarketing: { type: 'yesNo', default: 'no' },
    heightInCms: { type: 'integer', default: 0 },
    ownedCarId: { type: 'uuid' },
    age: { type: 'integer', isDeprecated: true }
  },
  validate: doc => {
    if ((doc.addressLines || '').includes('castle')) {
      throw new Error('No castle dwellers allowed')
    }
  },
  calculatedFields: {
    fullAddress: {
      inputFields: ['addressLines', 'postCode'],
      type: 'mediumString',
      value: data => `${data.addressLines ? data.addressLines + '\n' : ''}${data.postCode || ''}`
    },
    displayName: {
      inputFields: ['shortName', 'fullName'],
      type: 'mediumString',
      value: data => data.shortName || data.fullName || 'Guest'
    }
  },
  filters: {
    byPostCode: {
      parameters: {
        postCode: { type: 'string', isRequired: true }
      },
      implementation: input => d => d.postCode === input.postCode
    }
  },
  ctor: {
    parameters: {
      askedAboutMarketing: { type: 'boolean', isRequired: true }
    },
    implementation: input => {
      return {
        tenantId: 'companyA',
        allowMarketing: input.askedAboutMarketing ? 'yes' : 'no'
      }
    }
  },
  operations: {
    replaceFavouriteColors: {
      parameters: {
        newFavouriteColors: { type: 'shortString', isArray: true, isRequired: true }
      },
      implementation: (doc, input) => ({
        favouriteColors: ['silver'].concat(input.newFavouriteColors)
      })
    },
    attemptToChangeId: {
      paragraphs: ['Used in the tests to check that system fields cannot be changed.'],
      parameters: {},
      implementation: (doc, input) => ({
        id: 'new_value'
      })
    }
  }
}

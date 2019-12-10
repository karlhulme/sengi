/* istanbul ignore file */

module.exports = {
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
    tenantId: { type: 'shortString', isRequired: true, description: 'The organisation that owns the record.' },
    shortName: { type: 'shortString', isRequired: true, canUpdate: true, description: 'A short informal name, typically the person\'s first name.' },
    fullName: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The person\'s full name.' },
    dateOfBirth: { type: 'date', canUpdate: true, description: 'The date of birth.' },
    addressLines: { type: 'longString', canUpdate: true, description: 'The current residential address with each line separated by a newline (\\n) character.' },
    postCode: { type: 'shortString', canUpdate: true, description: 'A postal code.' },
    pinCode: { type: 'positiveInteger', description: 'The code used for clocking in.' },
    favouriteColors: { type: 'shortString', isArray: true, description: 'An array of color names.' },
    allowMarketing: { type: 'yesNo', default: 'no', description: 'A value of \'yes\' indicates that the person is prepared to receive marketing or \'no\' if they are not.' },
    heightInCms: { type: 'integer', default: 0, description: 'The height of the person in centimetres.' },
    ownedCarId: { ref: 'car', cacheDurationInSeconds: 60, description: 'The car owned by this person.' }
  },
  validate: doc => {
    if ((doc.addressLines || '').includes('castle')) {
      throw new Error('No castle dwellers allowed')
    }
  },
  calculatedFields: {
    fullAddress: {
      description: 'The full residential postal address.',
      inputFields: ['addressLines', 'postCode'],
      value: data => `${data.addressLines ? data.addressLines + '\n' : ''}${data.postCode || ''}`
    },
    displayName: {
      description: 'The shortName of the person if available, otherwise the fullName, otherwise \'Guest\'',
      inputFields: ['shortName', 'fullName'],
      value: data => data.shortName || data.fullName || 'Guest'
    }
  },
  filters: {
    byPostCode: {
      description: 'Fetch people that live at the appropriate post code.',
      parameters: {
        postCode: { type: 'string', isRequired: true, description: 'The post code to match.' }
      },
      implementation: input => d => d.postCode === input.postCode
    }
  },
  ctor: {
    parameters: {
      shortName: { lookup: 'field', isRequired: true },
      fullName: { lookup: 'field', isRequired: true },
      dateOfBirth: { lookup: 'field', isRequired: true },
      askedAboutMarketing: { type: 'boolean', isRequired: true, description: 'This is an additional field.' }
    },
    implementation: input => {
      return {
        tenantId: 'companyA',
        shortName: input.shortName,
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        allowMarketing: input.askedAboutMarketing ? 'yes' : 'no'
      }
    }
  },
  operations: {
    replaceFavouriteColors: {
      title: 'Replace Favourite Colors',
      description: 'Replace the favourite colors of this person.',
      parameters: {
        favouriteColors: { lookup: 'field', isRequired: true }
      },
      implementation: (doc, input) => ({
        favouriteColors: ['silver'].concat(input.favouriteColors)
      })
    },
    attemptToChangeId: {
      title: 'Attempt to Change Id',
      description: 'Used in the tests to check that system fields cannot be changed.',
      parameters: {},
      implementation: (doc, input) => ({
        id: 'new_value'
      })
    }
  }
}

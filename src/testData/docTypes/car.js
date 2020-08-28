/* istanbul ignore file */

module.exports = {
  name: 'car',
  pluralName: 'cars',
  title: 'Car',
  pluralTitle: 'Cars',
  policy: {
    canFetchWholeCollection: false,
    maxOpsSize: 10
  },
  fields: {
    manufacturer: { type: 'mediumString', isRequired: true, canUpdate: true },
    model: { type: 'mediumString', isRequired: true, canUpdate: true },
    registration: { type: 'shortString', isRequired: true, canUpdate: true }
  },
  calculatedFields: {
    displayName: {
      inputFields: ['manufacturer', 'model'],
      type: 'mediumString',
      value: data => `${data.manufacturer || ''} ${data.model || ''}`
    }
  },
  preSave: doc => {
    if (doc.originalOwner) {
      delete doc.originalOwner
    }
  },
  validate: doc => {
    if (doc.registration && !doc.registration.startsWith('HG')) {
      throw new Error('Unrecognised vehicle registration prefix.')
    }
  },
  ctor: {
    parameters: {},
    implementation: () => ({})
  },
  filters: {},
  operations: {}
}

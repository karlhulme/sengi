/* istanbul ignore file */

module.exports = {
  name: 'car',
  pluralName: 'cars',
  title: 'Car',
  pluralTitle: 'Cars',
  policy: {
    canFetchWholeCollection: false
  },
  fields: {
    manufacturer: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The name of a car manufacturer.' },
    model: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The model of a car.' },
    registration: { type: 'shortString', isRequired: true, canUpdate: true, description: 'A registration number that begins with HG.' }
  },
  calculatedFields: {
    displayName: {
      description: 'The manufacturer and model of the vehicle',
      inputFields: ['manufacturer', 'model'],
      value: data => `${data.manufacturer || ''} ${data.model || ''}`
    }
  },
  validate: doc => {
    if (doc.registration && !doc.registration.startsWith('HG')) {
      throw new Error('Unrecognised vehicle registration prefix.')
    }
  },
  ctor: {
    parameters: {
      manufacturer: { lookup: 'field' },
      model: { lookup: 'field' },
      registration: { lookup: 'field' }
    },
    implementation: data => {
      return {
        manufacturer: data.manufacturer,
        model: data.model,
        registration: data.registration
      }
    }
  }
}

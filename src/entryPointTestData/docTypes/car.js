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
    manufacturer: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The name of a car manufacturer.', example: 'Ford' },
    model: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The model of a car.', example: 'Fiesta' },
    registration: { type: 'shortString', isRequired: true, canUpdate: true, description: 'A registration number that begins with HG.', example: 'HG52 8HK' }
  },
  calculatedFields: {
    displayName: {
      description: 'The manufacturer and model of the vehicle',
      inputFields: ['manufacturer', 'model'],
      type: 'mediumString',
      example: 'Ford Fiesta',
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

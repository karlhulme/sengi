/* istanbul ignore file */

import { DocType } from 'sengi-interfaces'

export const car: DocType = {
  name: 'car',
  pluralName: 'cars',
  title: 'Car',
  pluralTitle: 'Cars',
  summary: 'A car',
  documentation: 'The information about a car document.',
  examples: [],
  patchExamples: [],
  policy: {
    canDeleteDocuments: false,
    canReplaceDocuments: false,
    canFetchWholeCollection: false,
    maxOpsSize: 10
  },
  docStoreOptions: {},
  fields: {
    manufacturer: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: 'The manufacturer of the car.' },
    model: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: 'The model of the car.' },
    registration: { type: 'shortString', isRequired: true, canUpdate: true, documentation: 'The registration number that appears on the car plate.' }
  },
  calculatedFields: {
    displayName: {
      documentation: 'A combination of manufacturer and model.',
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
    if (doc.registration && !(doc.registration as string).startsWith('HG')) {
      throw new Error('Unrecognised vehicle registration prefix.')
    }
  },
  ctor: {
    title: 'New car',
    documentation: 'Creates a new car.',
    examples: [],
    parameters: {},
    implementation: () => ({})
  },
  filters: {},
  operations: {},
  aggregates: {}
}

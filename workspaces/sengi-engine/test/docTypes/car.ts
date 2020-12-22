/* istanbul ignore file */

import { DocType } from 'sengi-interfaces'

export const car: DocType = {
  name: 'car',
  pluralName: 'cars',
  title: 'Car',
  pluralTitle: 'Cars',
  summary: '',
  documentation: '',
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
    manufacturer: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: '' },
    model: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: '' },
    registration: { type: 'shortString', isRequired: true, canUpdate: true, documentation: '' }
  },
  calculatedFields: {
    displayName: {
      documentation: '',
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
    documentation: '',
    examples: [],
    parameters: {},
    implementation: () => ({})
  },
  filters: {},
  operations: {},
  aggregates: {}
}

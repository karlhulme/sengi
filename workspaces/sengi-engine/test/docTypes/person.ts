/* istanbul ignore file */

import { Doc, DocFragment, DocPatch, DocType } from 'sengi-interfaces'

export const person: DocType = {
  name: 'person',
  pluralName: 'persons',
  title: 'Person',
  pluralTitle: 'Persons',
  summary: '',
  documentation: '',
  policy: {
    canFetchWholeCollection: true,
    canReplaceDocuments: true,
    canDeleteDocuments: true,
    maxOpsSize: 5
  },
  docStoreOptions: {},
  examples: [],
  patchExamples: [],
  fields: {
    tenantId: { type: 'shortString', isRequired: true, documentation: '' },
    shortName: { type: 'shortString', isRequired: true, canUpdate: true, documentation: '' },
    fullName: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: '' },
    dateOfBirth: { type: 'shortString', canUpdate: true, documentation: '' },
    addressLines: { type: 'mediumString', canUpdate: true, documentation: '' },
    postCode: { type: 'shortString', canUpdate: true, documentation: '' },
    pinCode: { type: 'positiveInteger', documentation: '' },
    favouriteColors: { type: 'shortString', isArray: true, documentation: '' },
    allowMarketing: { type: 'shortString', default: 'no', documentation: '' },
    heightInCms: { type: 'positiveInteger', default: 1, documentation: '' },
    age: { type: 'positiveInteger', deprecation: 'Use DOB instead', documentation: '' }
  },
  validate: doc => {
    if ((doc.addressLines as string || '').includes('castle')) {
      throw new Error('No castle dwellers allowed')
    }
  },
  calculatedFields: {
    fullAddress: {
      documentation: '',
      inputFields: ['addressLines', 'postCode'],
      type: 'mediumString',
      value: data => `${data.addressLines ? data.addressLines + '\n' : ''}${data.postCode || ''}`
    },
    displayName: {
      documentation: '',
      inputFields: ['shortName', 'fullName'],
      type: 'mediumString',
      value: data => data.shortName || data.fullName || 'Guest'
    }
  },
  filters: {
    byPostCode: {
      title: '',
      documentation: '',
      parameters: {
        postCode: { type: 'shortString', isRequired: true, documentation: '' }
      },
      implementation: input => (d: Doc) => d.postCode === input.postCode,
      examples: []
    }
  },
  ctor: {
    title: '',
    documentation: '',
    examples: [],
    parameters: {
      askedAboutMarketing: { type: 'shortString', isRequired: true, documentation: '' }
    },
    implementation: (input: DocFragment): Doc => {
      return {
        tenantId: 'companyA',
        allowMarketing: input.askedAboutMarketing === 'yes' ? 'yes' : 'no'
      }
    }
  },
  operations: {
    replaceFavouriteColors: {
      title: '',
      documentation: '',
      examples: [],
      parameters: {
        newFavouriteColors: { type: 'shortString', isArray: true, isRequired: true, documentation: '' }
      },
      implementation: (doc: Doc, input: DocFragment): DocPatch => ({
        favouriteColors: ['silver'].concat(input.newFavouriteColors as string[])
      })
    },
    attemptToChangeId: {
      title: '',
      documentation: '',
      examples: [],
      parameters: {},
      implementation: (): DocPatch => ({
        id: 'new_value'
      })
    }
  },
  aggregates: {}
}

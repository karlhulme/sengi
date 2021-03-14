/* istanbul ignore file */

import { Doc, DocFragment, DocPatch, DocType } from 'sengi-interfaces'

export const person: DocType = {
  name: 'person',
  pluralName: 'persons',
  title: 'Person',
  pluralTitle: 'Persons',
  summary: 'A person document',
  documentation: 'All the information about this person document type.',
  policy: {
    canFetchWholeCollection: true,
    canReplaceDocuments: true,
    canDeleteDocuments: true,
    maxOpsSize: 5
  },
  docStoreOptions: {},
  examples: [],
  fields: {
    tenantId: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, documentation: 'The id of a tenant.' },
    shortName: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, canUpdate: true, documentation: 'The short name for the person.' },
    fullName: { type: 'https://jsonotron.org/jsl/mediumString', isRequired: true, canUpdate: true, documentation: 'The person\'s full name.' },
    dateOfBirth: { type: 'https://jsonotron.org/jsl/shortString', canUpdate: true, documentation: 'The date the person was born.' },
    addressLines: { type: 'https://jsonotron.org/jsl/mediumString', canUpdate: true, documentation: 'The lines of the address where the person lives.' },
    postCode: { type: 'https://jsonotron.org/jsl/shortString', canUpdate: true, documentation: 'A UK postcode.' },
    pinCode: { type: 'https://jsonotron.org/jsl/positiveInteger', documentation: 'A pin code for the person.' },
    favouriteColors: { type: 'https://jsonotron.org/jsl/shortString', isArray: true, documentation: 'An array of the person\s favourite colors.' },
    allowMarketing: { type: 'https://jsonotron.org/jsl/shortString', default: 'no', documentation: 'Yes, if the person allows marketing.' },
    heightInCms: { type: 'https://jsonotron.org/jsl/positiveInteger', default: 1, documentation: 'The height of the person in centimeters' },
    age: { type: 'https://jsonotron.org/jsl/positiveInteger', deprecation: 'Use DOB instead', documentation: 'The age of the person.' }
  },
  validate: doc => {
    if ((doc.addressLines as string || '').includes('castle')) {
      throw new Error('No castle dwellers allowed')
    }
  },
  calculatedFields: {
    fullAddress: {
      documentation: 'A combination of address lines and postcode.',
      inputFields: ['addressLines', 'postCode'],
      type: 'https://jsonotron.org/jsl/mediumString',
      value: data => `${data.addressLines ? data.addressLines + '\n' : ''}${data.postCode || ''}`
    },
    displayName: {
      documentation: 'A combination of the short name and full name.',
      inputFields: ['shortName', 'fullName'],
      type: 'https://jsonotron.org/jsl/mediumString',
      value: data => data.shortName || data.fullName || 'Guest'
    }
  },
  filters: {
    byPostCode: {
      title: 'Filter by Post code.',
      documentation: 'Return only the people that live at a specified post code.',
      parameters: {
        postCode: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, documentation: 'A UK postcode.' }
      },
      implementation: input => (d: Doc) => d.postCode === input.postCode,
      examples: []
    }
  },
  ctor: {
    title: 'Create Person',
    documentation: 'Information about creating a person.',
    examples: [],
    parameters: {
      askedAboutMarketing: { type: 'https://jsonotron.org/jsl/shortString', isRequired: true, documentation: 'A description of how the person was asked about marketing.' }
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
      title: 'Replace Favourite Colors',
      documentation: 'Information about replacing the favourite colors.',
      examples: [],
      parameters: {
        newFavouriteColors: { type: 'https://jsonotron.org/jsl/shortString', isArray: true, isRequired: true, documentation: 'An array of the new colors.' }
      },
      implementation: (doc: Doc, input: DocFragment): DocPatch => ({
        favouriteColors: ['silver'].concat(input.newFavouriteColors as string[])
      })
    },
    attemptToChangeId: {
      title: 'Attempt to Change Id',
      documentation: 'A faulty operation.',
      examples: [],
      parameters: {},
      implementation: (): DocPatch => ({
        id: 'new_value'
      })
    }
  },
  aggregates: {}
}

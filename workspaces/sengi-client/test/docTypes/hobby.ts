/* istanbul ignore file */

import { Doc, DocType } from 'sengi-interfaces'

export const hobby: DocType = {
  name: 'hobby',
  pluralName: 'hobbies',
  title: 'Hobby',
  pluralTitle: 'Hobbies',
  summary: '',
  documentation: '',
  policy: {
    maxOpsSize: 5,
    canDeleteDocuments: true,
    canFetchWholeCollection: true,
    canReplaceDocuments: true
  },
  fields: {
    name: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: 'The name of the hobby.' },
    inventor: { type: 'mediumString', canUpdate: true, documentation: 'The inventor of the hobby.' },
    rules: { type: 'mediumString', isArray: true, documentation: 'The rules of the hobby.' },
  },
  calculatedFields: {
  },
  filters: {
    byRulesCount: {
      title: 'By Rules Count',
      documentation: 'Fetch hobbies with a certain number of rules.',
      parameters: {
        minRules: { type: 'positiveInteger', isRequired: true, documentation: 'The minimum number of rules.' }
      },
      examples: [],
      implementation: input => (d: Doc) => (d.rules as string[] || []).length > input.minRules
    }
  },
  operations: {
    addRule: {
      title: 'Add Rule',
      documentation: 'Adds a rule.',
      parameters: {
        newRule: { type: 'mediumString', isRequired: true, documentation: 'The new rule.' }
      },
      examples: [],
      implementation: (doc, input) => ({
        rules: (doc.rules as string[] || []).concat([input.newRule as string])
      })
    }
  },
  aggregates: {},
  ctor: {
    title: 'New hobby',
    documentation: 'Create a new hobby',
    implementation: () => ({}),
    examples: [],
    parameters: {}
  },
  docStoreOptions: {},
  examples: [],
  patchExamples: []
}
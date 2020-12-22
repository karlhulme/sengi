/* istanbul ignore file */

import { Doc, DocFragment, DocType } from 'sengi-interfaces'

export const film: DocType = {
  name: 'film',
  pluralName: 'films',
  title: 'Film',
  pluralTitle: 'Films',
  summary: '',
  documentation: '',
  policy: {
    maxOpsSize: 5,
    canDeleteDocuments: true,
    canFetchWholeCollection: true,
    canReplaceDocuments: true
  },
  fields: {
    filmTitle: { type: 'mediumString', isRequired: true, canUpdate: true, documentation: 'The title of the film.' },
    durationInMinutes: { type: 'positiveInteger', documentation: 'The runtime of the movie in minutes.' },
    castMembers: { type: 'mediumString', isRequired: true, isArray: true, documentation: 'A list of cast members.' }
  },
  calculatedFields: {
    totalCastSize: {
      inputFields: ['castMembers'],
      documentation: 'The number of cast members.',
      type: 'integer',
      value: doc => (doc.castMembers as string[] || []).length
    }
  },
  filters: {
    byRuntime: {
      title: 'By runtime',
      documentation: 'Fetch films that exceed the given runtime.',
      parameters: {
        minRuntime: { type: 'positiveInteger', isRequired: true, documentation: 'A film duration in minutes.' }
      },
      examples: [],
      implementation: input => (d: Doc) => d.durationInMinutes > input.minRuntime
    },
    byCastIncludesBob: {
      title: 'By cast includes Bob',
      documentation: 'Fetch films that star a person named Bob.',
      parameters: {},
      examples: [],
      implementation: () => (d: Doc) => (d.castMembers as string[] || []).findIndex(cm => cm.startsWith('Bob')) > -1
    }
  },
  operations: {
    addCastMember: {
      title: 'Add Cast Member',
      documentation: 'Adds a cast member to the list.',
      parameters: {
        actor: { type: 'mediumString', isRequired: true, documentation: 'The name of an actor.' }
      },
      examples: [],
      implementation: (doc, input) => ({
        castMembers: (doc.castMembers as string[] || []).concat([input.actor as string])
      })
    }
  },
  aggregates: {},
  ctor: {
    title: 'New film',
    documentation: '',
    implementation: (d: DocFragment) => ({
      durationInMinutes: d.initialDurationInMinutes,
      castMembers: d.initialCastMembers
    }),
    examples: [],
    parameters: {
      initialDurationInMinutes: { type: 'positiveInteger', documentation: '', isRequired: true },
      initialCastMembers: { type: 'mediumString', documentation: '', isArray: true }
    }
  },
  docStoreOptions: {},
  examples: [],
  patchExamples: []
}
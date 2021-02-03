import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'

export function createCarDocType (): DocType {
  return {
    name: 'car',
    title: 'Car',
    pluralName: 'cars',
    pluralTitle: 'Cars',
    summary: 'A car',
    documentation: 'This is a car document type.',

    fields: {},
    examples: [],
    patchExamples: [],

    aggregates: {},
    calculatedFields: {},
    ctor: {
      title: 'New car',
      documentation: 'Create a new car',
      parameters: {},
      examples: [],
      implementation: () => ({})
    },
    filters: {},
    operations: {},
    docStoreOptions: {},
    policy: {
      canDeleteDocuments: true,
      canFetchWholeCollection: true,
      canReplaceDocuments: true,
      maxOpsSize: 3
    }
  }
}

export function createLessonDocType (): DocType {
  return {
    name: 'lesson',
    title: 'Lesson',
    pluralName: 'lessons',
    pluralTitle: 'Lessons',
    summary: 'A lesson',
    documentation: 'This is a lesson document type.',
    fields: {
      teacher: { type: 'string', documentation: 'The teacher', canUpdate: true, isRequired: true }
    },
    examples: [{
      documentation: 'An example lesson',
      value: {
        teacher: 'Mr Jones'
      }
    }],
    patchExamples: [{
      documentation: 'An example patch to a lesson',
      value: {
        teacher: 'Mrs Jones'
      }
    }],
    aggregates: {
      sumOfStudents: {
        title: 'Sum of students',
        documentation: 'The docs',
        fields: {
          result: { type: 'positiveInteger', documentation: 'The docs' }
        },
        implementation: () => ({}),
        examples: [{
          documentation: 'An example of sum',
          value: {
            decimalPlaces: 2
          }
        }],
        parameters: {
          decimalPlaces: { type: 'integer', documentation: 'The docs' }
        }
      }
    },
    calculatedFields: {
      revenue: {
        type: 'positiveFloat',
        documentation: 'Calculated field docs',
        inputFields: ['a', 'b'],
        value: () => 100000
      }
    },
    ctor: {
      title: 'New lesson',
      documentation: 'Create a new lesson',
      parameters: {
        numberOfClasses: { type: 'integer', documentation: 'Ctor parameter docs' }
      },
      examples: [{
        documentation: 'The ctor example',
        value: {
          numberOfClasses: 10
        }
      }],
      implementation: () => ({})
    },
    filters: {
      byMatureStudents: {
        title: 'By Mature Students',
        documentation: 'filter docs',
        implementation: () => ({}),
        parameters: {
          cutoff: { type: 'integer', documentation: 'Filter param docs' }
        },
        examples: [{
          documentation: 'Filter example',
          value: {
            cutoff: 40
          }
        }]
      }
    },
    operations: {
      pass: {
        title: 'Pass',
        documentation: 'Operation docs',
        implementation: () => ({}),
        parameters: {
          score: { type: 'integer', documentation: 'Operation param docs' }
        },
        examples: [{
          documentation: 'Operation example',
          value: {
            score: 79
          }
        }]
      }
    },
    docStoreOptions: {},
    policy: {
      canDeleteDocuments: true,
      canFetchWholeCollection: true,
      canReplaceDocuments: true,
      maxOpsSize: 3
    }
  }
}

test('Prevent warnings about no tests found in file.', () => {
  expect(typeof createCarDocType()).toEqual('object')
})

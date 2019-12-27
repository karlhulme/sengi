module.exports = {
  title: 'Document Type Schema',
  type: 'object',
  description: 'The definition of a document type.',
  additionalProperties: false,
  properties: {
    name: { type: 'string', description: 'Internal singular name.' },
    pluralName: { type: 'string', description: 'Internal plural name.' },
    title: { type: 'string', description: 'Display singular name.' },
    pluralTitle: { type: 'string', description: 'Display plural name.' },

    /* The fields that are stored in the database for this doc type. */
    fields: {
      type: 'object',
      description: 'The set of fields for the document type, keyed by name.',
      additionalProperties: {
        type: 'object',
        oneOf: [{
          additionalProperties: false,
          properties: {
            type: { type: 'string', description: 'Type of the document field.' },
            isRequired: { type: 'boolean', description: 'True if this field must always be populated.' },
            isArray: { type: 'boolean', description: 'True if this field is an array.' },
            deprecation: { type: 'string', description: 'A description of the field(s) that should be used in place of this deprecated one.' },
            default: { type: ['string', 'number', 'boolean', 'object', 'array'], description: 'The value to be used if a field value is not supplied.' },
            canUpdate: { type: 'boolean', description: 'True if this field can be updated via a merge patch rather than an operation.' },
            description: { type: 'string', description: 'The description of the field.' }
          },
          required: ['type', 'description']
        }, {
          additionalProperties: false,
          properties: {
            ref: { type: 'string', description: 'The name of the document type referenced by this field.' },
            cacheDurationInSeconds: { type: 'number', description: 'The number of seconds that referenced documents can be cached.' },
            description: { type: 'string', description: 'The description of the field.' }
          },
          required: ['ref', 'cacheDurationInSeconds']
        }],
        description: 'Each property defines a field on the document type.'
      }
    },

    /* A function (doc) that raises an Error if the given doc does not contain valid field values.
       This function is used to perform validation where fields might depend upon each other. */
    validate: { customTypeOf: 'function' },

    /* The fields that are derivable from existing fields. */
    calculatedFields: {
      type: 'object',
      description: 'The set of calculated fields, keyed by name.',
      additionalProperties: {
        type: 'object',
        description: 'Each property defines a calculated field.',
        additionalProperties: false,
        properties: {
          description: { type: 'string', description: 'The description of the calculated field.' },
          inputFields: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          value: { customTypeOf: 'function' }
        },
        required: ['description', 'inputFields', 'value']
      }
    },

    /* A set of functions for retrieving a subset of the docs from the database. */
    filters: {
      type: 'object',
      description: 'The set of filters, keyed by name.',
      additionalProperties: {
        type: 'object',
        description: 'Each property defines a filter',
        additionalProperties: false,
        properties: {
          description: { type: 'string', description: 'The description of the filter.' },
          parameters: {
            type: 'object',
            description: 'The set of filter parameters',
            additionalProperties: {
              type: 'object',
              description: 'Each property defines a filter parameter.',
              additionalProperties: false,
              properties: {
                type: { type: 'string', description: 'The field type of the filter parameter.' },
                isRequired: { type: 'boolean', description: 'True if the parameter must be supplied.' },
                description: { type: 'string', description: 'The description of the usage or purpose of the filter parameter.' }
              },
              required: ['type', 'description']
            }
          },
          implementation: { customTypeOf: 'function' }
        },
        required: ['description', 'parameters', 'implementation']
      }
    },

    /* A function that creates a new instance of this document. */
    ctor: {
      type: 'object',
      description: 'A mechanism for constructing new instances of the document type.',
      additionalProperties: false,
      properties: {
        parameters: {
          type: 'object',
          description: 'A set of constructor parameters, keyed by name.',
          additionalProperties: {
            type: 'object',
            oneOf: [{
              additionalProperties: false,
              properties: {
                type: { type: 'string', description: 'Type of the constructor parameter.' },
                isRequired: { type: 'boolean', description: 'True if this parameter must be provided.' },
                description: { type: 'string', description: 'The description of the constructor parameter.' }
              },
              required: ['type', 'description']
            }, {
              additionalProperties: false,
              properties: {
                lookup: { enum: ['field'], description: 'Indicates the definition of this parameter should be taken from the document fields.' },
                isRequired: { type: 'boolean', description: 'True if this parameter must be provided.' }
              },
              required: ['lookup']
            }],
            description: 'Each property defines a constructor parameter.'
          }
        },
        implementation: { customTypeOf: 'function' }
      },
      required: ['parameters', 'implementation']
    },

    /* A set of functions that are used to operate on the document. */
    operations: {
      type: 'object',
      description: 'A set of operations, keyed by name.',
      additionalProperties: {
        type: 'object',
        description: 'Each property defines an operation.',
        additionalProperties: false,
        properties: {
          title: { type: 'string', description: 'The display name of the operation.' },
          description: { type: 'string', description: 'A description of the operation.' },
          parameters: {
            type: 'object',
            description: 'A set of operation parameters, keyed by name.',
            additionalProperties: {
              type: 'object',
              oneOf: [{
                additionalProperties: false,
                properties: {
                  type: { type: 'string', description: 'Type of the operation parameter.' },
                  isRequired: { type: 'boolean', description: 'True if this parameter must be provided.' },
                  description: { type: 'string', description: 'The description of the operation parameter.' }
                },
                required: ['type', 'description']
              }, {
                additionalProperties: false,
                properties: {
                  lookup: { enum: ['field'], description: 'Indicates the definition of this parameter should be taken from the document fields.' },
                  isRequired: { type: 'boolean', description: 'True if this parameter must be provided.' }
                },
                required: ['lookup']
              }],
              description: 'Each property defines a operation parameter.'
            }
          },
          implementation: { customTypeOf: 'function' }
        },
        required: ['title', 'description', 'parameters', 'implementation']
      }
    },

    /* Parameters that determine how the doc type is handled. */
    policy: {
      type: 'object',
      additionalProperties: false,
      properties: {
        canFetchWholeCollection: { type: 'boolean' },
        canReplaceDocuments: { type: 'boolean' },
        maxOpsSize: { type: 'number' }
      }
    },

    /* Any options that should be passed to the document store. */
    docStoreOptions: {
      type: 'object',
      additionalProperties: true
    }
  },
  required: [
    'name', 'pluralName', 'title', 'pluralTitle', 'fields'
  ]
}
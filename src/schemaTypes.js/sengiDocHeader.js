const validTestCaseAndExample = {
  origin: {
    userIdentity: 'testUser',
    dateTime: '2000-01-01T12:00:00Z'
  },
  updated: {
    userIdentity: 'testUser',
    dateTime: '2000-01-03T18:30:00Z'
  },
  ops: [{
    opId: '123e4567-e89b-12d3-a456-426655440000',
    userIdentity: 'testUser',
    dateTime: '2000-01-03T18:30:00Z',
    style: 'operation',
    operationName: 'doSomething'
  }],
  calcs: {
    total: { value: 25 },
    fullText: { value: 'First Part and Second Part Together' }
  }
}

export const sysDocHeader = {
  name: 'sysDocHeader',
  title: 'System Document Header',
  paragraphs: [
    'A block that contains header information about the document that is maintained by the engine.',
    'The `origin` object includes information about who created the document, when it was created and how.',
    'The `updated` object indicates when the document was last updated and by whom.',
    'The `ops` object contains an array of the operations applied to the document.  This is used to prevent the same operation being applied twice.',
    'The `calcs` object can properties for each of the calculated fields and their values at the point of last save.  If the definition of a calculated field is changed with a doc type, then affected documents will not be updated until they are updated.'
  ],
  examples: [{ value: validTestCaseAndExample, paragraphs: ['An example.'] }],
  jsonSchema: {
    type: 'object',
    properties: {
      // An object that describes the origin of the document
      origin: {
        type: 'object',
        properties: {
          userIdentity: { $ref: '#/definitions/longString' },
          dateTime: { $ref: '#/definitions/dateTimeUtc' }
        },
        required: ['userIdentity', 'dateTime']
      },
      // An object that describes the last time the document was updated.
      updated: {
        type: 'object',
        properties: {
          userIdentity: { $ref: '#/definitions/longString' },
          dateTime: { $ref: '#/definitions/dateTimeUtc' }
        },
        required: ['userIdentity', 'dateTime']
      },
      // An object that describes the last X operations on the document.
      ops: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            opId: { $ref: '#/definitions/uuid' },
            userIdentity: { $ref: '#/definitions/longString' },
            dateTime: { $ref: '#/definitions/dateTimeUtc' },
            style: { enum: ['patch', 'operation'] },
            operationName: { type: 'string' }
          },
          required: ['opId', 'userIdentity', 'dateTime', 'style']
        }
      },
      // An object that contains calculated field values as determined at the last update - might be used by filters.
      calcs: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            value: {}
          }
        }
      }
    },
    required: ['origin', 'updated', 'ops', 'calcs']
  },
  referencedSchemaTypes: ['sysOpId', 'sysOpId', 'sysDateTime', 'sysUserIdentity']
}

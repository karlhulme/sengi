module.exports = {
  name: 'sysMarker',
  pluralName: 'sysMarkers',
  title: 'System Marker',
  pluralTitle: 'System Markers',
  policy: {
    canFetchWholeCollection: true,
    maxOpsSize: 10
  },
  fields: {
    docTypeName: { type: 'mediumString', isRequired: true, description: 'The name of a document type.' },
    fieldName: { type: 'mediumString', isRequired: true, description: 'The name of a field.' },
    nextSequenceNo: { type: 'positiveInteger', isRequired: true, description: 'The next number to be issued.' }
  },
  ctor: {
    parameters: {
      docTypeName: { lookup: 'field', isRequired: true },
      fieldName: { lookup: 'field', isRequired: true },
      initialSequenceNo: { type: 'positiveInteger', isRequired: true, description: 'The first number to be issued.' }
    },
    implementation: input => {
      return {
        docTypeName: input.docTypeName,
        fieldName: input.fieldName,
        nextSequenceNo: input.initialSequenceNo
      }
    }
  },
  operations: {
    issueSequenceNo: {
      title: 'Issue Sequence No',
      description: 'Issue a new sequence number.',
      parameters: {},
      implementation: (doc, input) => {
        const issuedNo = doc.nextSequenceNo
        doc.nextSequenceNo++

        return {
          issuedNo
        }
      }
    }
  }
}

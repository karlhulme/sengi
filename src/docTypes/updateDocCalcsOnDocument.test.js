/* eslint-env jest */
const updateDocCalcsOnDocument = require('./updateDocCalcsOnDocument')

const docType = {
  name: 'test',
  calculatedFields: {
    combined: {
      inputFields: ['propA', 'propB'],
      value: input => input.propA + ' ' + input.propB
    }
  }
}

test('Calculated fields are added to the docCalcs section of the doc.', () => {
  const doc = { propA: 'hello', propB: 'world', docCalcs: {} }
  updateDocCalcsOnDocument(docType, doc)
  expect(doc.docCalcs).toEqual({
    combined: {
      value: 'hello world'
    }
  })
})

test('Redundant calculated fields are removed to the docCalcs section of the doc.', () => {
  const doc = { propA: 'hello', propB: 'world', docCalcs: { oldCalc: 'abc' } }
  updateDocCalcsOnDocument(docType, doc)
  expect(doc.docCalcs).not.toHaveProperty('oldCalc')
})

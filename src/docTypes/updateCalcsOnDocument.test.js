/* eslint-env jest */
const updateCalcsOnDocument = require('./updateCalcsOnDocument')

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
  const doc = { propA: 'hello', propB: 'world', sys: { calcs: {} } }
  updateCalcsOnDocument(docType, doc)
  expect(doc.sys.calcs).toEqual({
    combined: {
      value: 'hello world'
    }
  })
})

test('Redundant calculated fields are removed to the docCalcs section of the doc.', () => {
  const doc = { propA: 'hello', propB: 'world', sys: { calcs: { oldCalc: 'abc' } } }
  updateCalcsOnDocument(docType, doc)
  expect(doc.sys.calcs).not.toHaveProperty('oldCalc')
})

/* eslint-env jest */
import { updateCalcsOnDocument } from './updateCalcsOnDocument'

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
  const doc = { propA: 'hello', propB: 'world', docHeader: {} }
  updateCalcsOnDocument(docType, doc)
  expect(doc.docHeader.calcs).toEqual({
    combined: {
      value: 'hello world'
    }
  })
})

test('Redundant calculated fields are removed from the calcs section of the doc.', () => {
  const doc = { propA: 'hello', propB: 'world', docHeader: { calcs: { oldCalc: 'abc' } } }
  updateCalcsOnDocument(docType, doc)
  expect(doc.docHeader.calcs).not.toHaveProperty('oldCalc')
})

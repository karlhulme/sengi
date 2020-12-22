import { DocType, DocFragment, SengiUnrecognisedAggregateNameError, SengiAggregateFailedError } from 'sengi-interfaces'

/**
 * Evaluate a doc type aggregate.
 * @param docType A doc type.
 * @param aggregateName The name of an aggregate.
 * @param aggregateParams A parameter object to be passed to the aggregate.
 */
export function evaluateAggregate (docType: DocType, aggregateName: string, aggregateParams: DocFragment): unknown  {
  const aggregate = docType.aggregates[aggregateName]

  if (!aggregate) {
    throw new SengiUnrecognisedAggregateNameError(docType.name, aggregateName)
  }

  try {
    return aggregate.implementation(aggregateParams)
  } catch (err) {
    throw new SengiAggregateFailedError(docType.name, aggregateName, err)
  }
}

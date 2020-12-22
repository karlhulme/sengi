import { DocType, SengiUnrecognisedAggregateNameError } from 'sengi-interfaces'

/**
 * Ensure that the given aggregate name is an aggregate defined
 * on the given document type.
 * @param docType A document type.
 * @param aggregateName The name of an aggregate.
 */
export function ensureAggregateName (docType: DocType, aggregateName: string): void {
  if (typeof docType.aggregates[aggregateName] !== 'object') {
    throw new SengiUnrecognisedAggregateNameError(docType.name, aggregateName)
  }
}

import {
  DocType,
  DocTypeAggregate,
  DocTypeAggregateField,
  DocTypeAggregateParameter,
  DocTypeCalculatedField,
  DocTypeConstructorParameter,
  DocTypeField,
  DocTypeFilter,
  DocTypeFilterParameter,
  DocTypeOperation,
  DocTypeOperationParameter,
  SerializableDocType,
  SerializableDocTypeAggregate,
  SerializableDocTypeAggregateField,
  SerializableDocTypeAggregateParameter,
  SerializableDocTypeCalculatedField,
  SerializableDocTypeConstructorParameter,
  SerializableDocTypeField,
  SerializableDocTypeFilter,
  SerializableDocTypeFilterParameter,
  SerializableDocTypeOperation,
  SerializableDocTypeOperationParameter,
  SengiTypeNotFoundError
} from 'sengi-interfaces'
import { Jsonotron } from 'jsonotron-js'

/**
 * Returns a new object where the value of each key is the result of
 * calling the converter function on each value of the given object.
 * @param obj A record object.
 * @param converter A function that converts an object from Source to Target.
 */
function convertKeys<Source, Target> (obj: Record<string, Source>, converter: (src: Source) => Target): Record<string, Target> {
  return Object.keys(obj).reduce((agg, cur) => {
    agg[cur] = converter(obj[cur])
    return agg
  }, {} as Record<string, Target>)
}

/**
 * Returns an object that contains typeDomain, typeSystem and typeName
 * keys that are appropriate for the given fully qualified type name.
 * @param jsonotron A jsonotron engine.
 * @param fullyQualifiedTypeName A fully qualified name of a type.
 */
function getJsonotronTypeProperties (jsonotron: Jsonotron, fullyQualifiedTypeName: string): { typeDomain: string, typeSystem: string, typeName: string } {
  const type = jsonotron.getType(fullyQualifiedTypeName)

  if (!type) {
    throw new SengiTypeNotFoundError(fullyQualifiedTypeName)
  }

  return {
    typeDomain: type.domain,
    typeSystem: type.system,
    typeName: type.name
  }
}

/**
 * Returns a serializable doc type.
 * @param docType A doc type.
 */
export function convertDocTypeToSerializableDocType (jsonotron: Jsonotron, docType: DocType): SerializableDocType {
  return {
    name: docType.name,
    pluralName: docType.pluralName,
    title: docType.title,
    pluralTitle: docType.pluralTitle,
    summary: docType.summary,
    documentation: docType.documentation,
    fields: convertKeys<DocTypeField, SerializableDocTypeField>(docType.fields, f => ({
      ...getJsonotronTypeProperties(jsonotron, f.type),
      documentation: f.documentation,
      deprecation: f.deprecation,
      default: f.default,
      canUpdate: f.canUpdate,
      isArray: f.isArray,
      isRequired: f.isRequired
    })),
    examples: docType.examples,
    calculatedFields: convertKeys<DocTypeCalculatedField, SerializableDocTypeCalculatedField>(docType.calculatedFields, calc => ({
      ...getJsonotronTypeProperties(jsonotron, calc.type),
      documentation: calc.documentation,
      deprecation: calc.deprecation,
      inputFields: calc.inputFields,
      isArray: calc.isArray
    })),
    filters: convertKeys<DocTypeFilter, SerializableDocTypeFilter>(docType.filters, f => ({
      title: f.title,
      documentation: f.documentation,
      deprecation: f.deprecation,
      examples: f.examples,
      parameters: convertKeys<DocTypeFilterParameter, SerializableDocTypeFilterParameter>(f.parameters, p => ({
        ...getJsonotronTypeProperties(jsonotron, p.type),
        documentation: p.documentation,
        deprecation: p.deprecation,
        isArray: p.isArray,
        isRequired: p.isRequired
      }))
    })),
    aggregates: convertKeys<DocTypeAggregate, SerializableDocTypeAggregate>(docType.aggregates, agg => ({
      title: agg.title,
      documentation: agg.documentation,
      examples: agg.examples,
      deprecation: agg.deprecation,
      fields: convertKeys<DocTypeAggregateField, SerializableDocTypeAggregateField>(agg.fields, f => ({
        ...getJsonotronTypeProperties(jsonotron, f.type),
        documentation: f.documentation,
        deprecation: f.deprecation,
        isArray: f.isArray
      })),
      parameters: convertKeys<DocTypeAggregateParameter, SerializableDocTypeAggregateParameter>(agg.parameters, p => ({
        ...getJsonotronTypeProperties(jsonotron, p.type),
        documentation: p.documentation,
        deprecation: p.deprecation,
        isArray: p.isArray,
        isRequired: p.isRequired
      }))
    })),
    ctor: {
      title: docType.ctor.title,
      documentation: docType.ctor.documentation,
      examples: docType.ctor.examples,
      parameters: convertKeys<DocTypeConstructorParameter, SerializableDocTypeConstructorParameter>(docType.ctor.parameters, p => ({
        ...getJsonotronTypeProperties(jsonotron, p.type),
        documentation: p.documentation,
        deprecated: p.deprecated,
        isArray: p.isArray,
        isRequired: p.isRequired
      }))
    },
    operations: convertKeys<DocTypeOperation, SerializableDocTypeOperation>(docType.operations, op => ({
      title: op.title,
      documentation: op.documentation,
      examples: op.examples,
      parameters: convertKeys<DocTypeOperationParameter, SerializableDocTypeOperationParameter>(op.parameters, p => ({
        ...getJsonotronTypeProperties(jsonotron, p.type),
        documentation: p.documentation,
        deprecation: p.deprecation,
        isArray: p.isArray,
        isRequired: p.isRequired
      })),
      deprecation: op.deprecation
    }))
  }
}

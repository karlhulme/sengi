# Sengi Engine
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-engine.svg)](https://www.npmjs.com/package/sengi-engine)

The core Sengi engine.

It interprets the field type definitions, doc type definitions and role definitions.

It validates and actions input requests, by issuing queries and instructions to the underlying datastore.

It mutates documents according to the defined operations and patch policy, performs validation checks, and upserts modified documents back to the data store.

Parameter and document validation is performed by [Jsonotron](https://github.com/karlhulme/jsonotron).


## Installation

```bash
npm install sengi-engine
```


## Usage

> This package is used by Sengi service implementations, such as `sengi-express`.  Unless you are creating a new public interface for Sengi then you probably don't want to use this package directly.

To instantiate a Sengi engine you have to provide the following parameters:

* **jsonotronTypes** An array of Jsonotron type strings (typically loaded from YAML files).  See the [jsonotron](https://github.com/karlhulme/jsonotron) repo for details.

* **jsonotronFormatValidators** An object where each key is the name of a format validator and each value is a `JsonSchenaFormatValidatorFunc`.  See the [jsonotron-js](https://github.com/karlhulme/jsonotron-js) repo for details.

* **docTypes** - An array of Sengi DocType objects as defined in the `sengi-interfaces` package.

* **roleTypes** - An array of Sengi RoleType objects as defined in the `sengi-interfaces` package.

* **docStore** - An object that implements the Sengi document store interface.  There are implementation for in-memory, Microsoft Azure Cosmos, Amazon AWS DynamoDB and MongoDB.

* **onPreSaveDoc** - A function `(props: PreSaveDocCallbackProps) => void` that is invoked just before a document is saved.  The doc that is passed to this function is subsequently passed to the document store to be persisted.

* **onPreQueryDocs** - A function `(props: PreQueryDocsCallbackProps) => void` that is invoked just before a query is executed.

* **onSavedDoc** - A function `(props: SavedDocCallbackProps) => void` that is invoked just after a document is persisted to the document store.

* **onDeleteDoc** - A function `(props: DeletedDocCallbackProps) => void` that is invoked just after a document is deleted.

The following example shows how to setup a Sengi-engine using the in-memory document store.

```javascript
const sengi = new Sengi({
  docTypes: [], // array of objects that implement DocType interface
  roleTypes: [], // array of objects that implement RoleType interface
  jsonotronTypes: [], // array of strings that are YAML jsonotron enum and schema type definitions
  docStore: new MemDocStore({ docs: [], generateDocVersionFunc: () => 'xxxx' })
})
```

## Methods

The Sengi engine provides the following methods.

Method Name | Parameters | Description
---|---|---
getDocTypeNameFromPluralName | `docTypePluralName: string` | Returns the singular doc type name for the given plural name, or null if not found.
getDocTypePluralNameFromName | `docTypeName: string` | Returns the plural doc type name for the given singular name, or null if not found.
getEnumTypeItems | `(fullyQualifiedEnumTypeName: string): RuntimeEnumTypeItem[]|null` | Returns the list of items that are defined within the given enum type.
getEnumTypeItemAsGraphQL | `(): string` | Returns a GraphQL type that represents an item from an enum.
getDocTypeAsGraphQL | `(props: GetDocTypeAsGraphQLProps): string` | Returns a set of GraphQL types and inputs for the named doc type and set of role types.  These types do not enforce the isRequired flag because it is expected that additional layers of processing may be applied between a graph service and the sengi-based data store.
createDocument | `props: CreateDocumentProps` | Creates a new document using a doc type constructor.  Returns `{ isNew }`.
deleteDocument | `props: DeleteDocumentProps` | Deletes an existing document.  Returns `{ isDeleted }`.
operateOnDocument | `props: OperateOnDocumentProps` | Operates on an existing document.  Returns `{ isUpdated }`.
patchDocument | `props: PatchDocumentProps` | Patches an existing document with a merge patch.  Use null to delete fields.  Returns `{ isUpdated }`.
queryDocumentsByFilter | `props: QueryDocumentsByFilterProps` | Queries for a set of documents using a filter.  Returns `{ deprecations, docs }`.
queryDocumentsByIds | `props: QueryDocumentsByIdsProps` | Queries for a set of documents using an array of document ids.  Returns `{ deprecations, docs }`.
queryDocuments | `props: QueryDocumentsProps` | Queries for all documents of a specified doc type.  Returns `{ deprecations, docs }`.
replaceDocument | `props: ReplaceDocumentProps` | Replaces (or inserts) a document, without using the doc type constructor.  Returns `{ isNew }`.

For the document-centric methods The properties `isNew`, `isDeleted` and `isUpdated` are booleans.

For the query-centric methods the property `deprecations` is an object that contains a key for each field that was requested and is also deprecated.  The value is a comment describing the reason for the deprecation and/or the fields to request instead.

For they query-centric methods the `docs` property is an array of `Doc` objects.  The objects will only contain the requested fields.

## Development

Tests are written using Jest with 100% coverage.

```bash
npm test
```


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.

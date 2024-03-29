# Sengi Engine
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-engine.svg)](https://www.npmjs.com/package/sengi-engine)

The core Sengi engine.

It interprets the field type definitions, doc type definitions and clients.

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

* **schemas** An array of schemas that may be referenced by parameter or filter objects.

* **userSchema** A schema that defines the user object that is passed to the doc type implementation and authorise functions.

* **docTypes** - An array of Sengi DocType objects as defined in the `sengi-interfaces` package.

* **clients** - An array of Sengi Client objects as defined in the `sengi-interfaces` package.

* **docStore** - An object that implements the Sengi document store interface.  There are implementation for in-memory, Microsoft Azure Cosmos, Amazon AWS DynamoDB and MongoDB.

* **onPreSaveDoc** - A function `(props: PreSaveDocCallbackProps) => void` that is invoked just before a document is saved.  The doc that is passed to this function is subsequently passed to the document store to be persisted.

* **onPreQueryDocs** - A function `(props: PreQueryDocsCallbackProps) => void` that is invoked just before a query is executed.

* **onSavedDoc** - A function `(props: SavedDocCallbackProps) => void` that is invoked just after a document is persisted to the document store.

* **onDeleteDoc** - A function `(props: DeletedDocCallbackProps) => void` that is invoked just after a document is deleted.

* **log** True if each request should be logged to the console.

* **getMillisecondsSinceEpoch** A function `() => number` that returns the number of milliseconds since the epoch.  A default implementation is provided so this is used primarily for testing.

* **getIdFromUser** A function `(user: User) => string` that returns the id of the given user object.  This is used by the engine to populate the docCreatedByUserId and docLastUpdatedByUserId common fields.  If this function is not provided then the value `<undefined>` will be used instead.

The following example shows how to setup a Sengi-engine using the in-memory document store.

```javascript
const sengi = new Sengi({
  docTypes: [], // array of objects that implement DocType interface
  clients: [], // array of objects that implement Client interface
  docStore: new MemDocStore({ docs: [], generateDocVersionFunc: () => 'xxxx' })
})
```

## Methods

The Sengi engine provides the following methods.

Method Name | Parameters | Description
---|---|---
getDocTypeNameFromPluralName | `docTypePluralName: string` | Returns the singular doc type name for the given plural name, or null if not found.
getDocTypePluralNameFromName | `docTypeName: string` | Returns the plural doc type name for the given singular name, or null if not found.
getApiKeysLoadedFromEnvCount | | Returns the number of api keys loaded from environment variables.
getApiKeysNotFoundInEnvCount | | Returns the number of api keys that were dropped because they referenced unknown environment variables.
createDocument | `props: CreateDocumentProps` | Creates a new document using a doc type constructor.  Returns `{ isNew }`.
deleteDocument | `props: DeleteDocumentProps` | Deletes an existing document.  Returns `{ isDeleted }`.
operateOnDocument | `props: OperateOnDocumentProps` | Operates on an existing document.  Returns `{ isUpdated }`.
patchDocument | `props: PatchDocumentProps` | Patches an existing document with a merge patch.  Use null to delete fields.  Returns `{ isUpdated }`.
queryDocuments | `props: QueryDocumentsProps` | Executes a query across a set of documents, typically an aggregate like sum or max.
replaceDocument | `props: ReplaceDocumentProps` | Replaces (or inserts) a document, without using the doc type constructor.  Returns `{ isNew }`.
selectDocumentsByFilter | `props: SelectDocumentsByFilterProps` | Selects a set of documents using a filter.  Returns `{ deprecations, docs }`.
selectDocumentsByIds | `props: SelectDocumentsByIdsProps` | Selects a set of documents using an array of document ids.  Returns `{ deprecations, docs }`.
selectDocuments | `props: SelectDocumentsProps` | Selects all documents of a specified doc type.  Returns `{ deprecations, docs }`.

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

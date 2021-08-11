# Sengi

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)

The Sengi mono-repo includes the following packages:

* **sengi-engine** - for processing requests.
* **sengi-express** - provides an HTTP/RESTful layer.
* **sengi-interfaces** - defines the shared types.
* **sengi-docstore-cosmosdb** - Document store wrapper for Cosmos DB (Microsoft Azure)
* **sengi-docstore-dynamodb** - Document store wrapper for Dynamo DB (Amazon AWS)
* **sengi-docstore-mongodb** - Document store wrapper for Mongo DB (Mongo)
* **sengi-docstore-mem** - In-memory document store


## Getting Started

To create a Sengi-based server, use the `createSengiExpress` function exported from the [sengi-express](https://github.com/karlhulme/sengi/blob/master/workspaces/sengi-express/readme.md) package.

You will need to choose a document store as well.  If you're just testing/playing then use the in-memory document store.  Otherwise choose between Microsoft Azure CosmosDB, Amazon AWS DynamoDB or Mongo.

It is much easier to supply valid `DocType` and `Client` objects if you use the Typescript definitions exported from `sengi-interfaces`.


## Doc Type

The Sengi system manages the creation, retrieval and mutation of JSON documents.  Each JSON document has a type that defines it's shape and the available operations.

Property | Description
---|---
name | The unique name of the doc type.
pluralName | The unique name of the doc type in plural form.  Some access patterns work better with a plural name, for example, a RESTful API for managing documents about books will use the plural name as follows: https://localhost:1234/docs/books?fields=author
title | The display name of the doc type.
pluralTitle | The display name of the doc type in plural form.
summary | A summary of the document type.
jsonSchema | A JSON schema definition that defines the fields that make up this document type.  This definition does not need to include the common fields (id, docType, docOpIds and docVersion) as the engine will add these automatically.
readOnlyFields | The names of the fields that cannot be patched directly.  These fields can be set by operations, constructors and a preSave function.  System field names are treated as readonly automatically. 
deprecation | If populated, it should describe the replacement document type to use instead of this one.
preSave | A function `(doc: Doc) => void` that is called prior to saving a document that can be used to perform cleanup.
validate | A function `(doc: Doc) => void` that is called prior to saving a document that can raise an error if the document is not valid and should not be saved.
constructors | A `Record<string, DocTypeConstructor<Doc, User, any>` that provides a range of constructors that can be used to create new documents.
filters | A `Record<string, DocTypeFilter<User, Filter, any>>` that provides a range of filters that can be used to return subsets of documents.  The required response from a filter implementation will depend on the choice of document store.
operations | A `Record<string, DocTypeOperation<Doc, User, any>>` that provides all the mutations that can be carried out server-side on a document.  An operation is useful where (a) you want to strictly control the types of mutation on a document, such as payment records, or (b) you want to allow rapid changes to a single field without clients patching it.
queries | A `Record<string, DocTypeQuery<User, any, any, QueryResult, Query>>` that provides a range of queries that can be executed across a collection of documents.
policy | A `DocTypePolicy` object that defines the types of permitted operations on the document.
docStoreOptions | A property bag that is passed to many of the document store operation callbacks.
authorise |  A function `(props: DocTypeAuthProps<Doc, User>) => string\|undefined` that is called prior to operating or selecting a document.


## Client

The Sengi system uses Client objects to control access to the documents.

Property | Description
---|---
name | The unique name of the role type.
docPermissions | Either true or an object where each key names a doc type...
docPermissions[docType].query | Either true, or an object with `{ fieldsTreatment: 'whitelist'|'blacklist', fields: string[] }`.  If the `fieldsTreatmnt` property is `'whitelist'` then the `fields` property defines the fields that can be queried.  If the `fieldsTreatmnt` property is `'blacklist'` then the `fields` property defines the only fields that cannot be retrieved.
docPermissions[docType].update | Either true, or an object with `{ patch: boolean, operations: string[] }`.  If the `patch` property is true then the role can apply merge patches to the `docType`.  The `operations` property lists the specific operations the role may carry out on the `docType`.
docPermissions[docType].create | True if the role permits `docType` to be created.
docPermissions[docType].delete | True if the role permits `docType` to be deleted.
docPermissions[docType].replace | True if the role permits `docType` to be replaced.
apiKeys | An array of api key strings.  A value prefixed with a dollar ($) sign, indicates that the string is an environment variable and the value should be loaded accordingly.


### API Keys

The Sengi-express server expects an `X-API_KEY` header to be provided with an api key.  This should match one of the API keys defined for one of the clients.

API keys are used to provide coarse-grained security on a per-client basis.  A client for sengi should be another service within your architecture, for example a GraphQL service.  The intention here is that you control both the client and the sengi service from within the network boundary.  A client should not be based on the public internet.

A GraphQL service might be entitled to read-only access.  Conversely, a lambda-style service may be allowed to make updates to most documents, but some critical document types are excluded.  You can define these requirements in a client, and then assign an API key.  You can generate an API key using any mechanism as Sengi does not require any specific format be used.  A good choice is to use a [UUID generator](https://www.guidgenerator.com/online-guid-generator.aspx) and tick the base64 encode option.


### User Object

A client can also supply a user object.  This should be in the format that Sengi expects, and is established when it is created, via the `userSchema` property.  This user object will then be made available to doc type methods so you can determine on a per-request basis whether to complete the request.


## Database Guidance

Document databases claim to be infinitely scalable but in practice documents will be divided up into physical sets.  Where possible, we want to query a single physical set as this will yield better performance than querying multiple physical sets.

To deal with this, we can consider most documents to be 1 of 2 possible types:


### An Authoritative Document

This document contains the largely normalised data for an entity.

The primary key is always a single unique id.  This ensures a good spread of documents across any logical or physical partitions created by the database while allowing us to access them with only one piece of information.

A **child authoritative document** is one that exists in a one-to-many relationship with a parent.  These records will need a secondary index on the field that links the child to the parent.  If the secondary index is actually a copy of the table (as per DynamoDB) then all keys (but not necessary all fields) should be projected into this secondary index.


### A Warehouse Document

This document contains largely denormalised data.  They have to build (a) directly in response to changes, or (b) periodically.

Like the authoritative documents, they should be given a primary key of a single unique id.  This ensures Sengi can still find, edit and remove individual records - however this won't be the common access pattern.

A warehouse document will then be given secondary indexes that satisfy the access patterns of the client, including domain-specific partition keys.

This key should divide the data up into chunks, typically a few GB.  Geographic values like salesRegion or salesOffice often work well.  We're trying to avoid hot partitions and achieve an even spread of data.  Most challenging of all, the partition key needs to be something that is passed with every (or at least most) queries.

If you have a dataset for which no partition key makes sense, then you can store all the records in the same physical partition.  For example use a partition key of docType, which will be the same for every record.  You will need to monitor this dataset to ensure it doesn't exceed the limits of the database storage for a single partition.  Be conservative about the quantity of fields stored for each warehouse record to maximise the number of records that can be stored in this way.


### Synchronisation

To keep all the documents in sync you'll need a mechanism that can write to multiple records in sequence in a fault-tolerant manner.  Crucially, if a second or third record needs to be updated but fails, you'll need a system that identifies these failed updates and provides a mechanism to retry or resume at a later point.  You don't want a system that silently fails and leads to increasing synchronisation issues.


## Guidance on Filters

Filters should generally hit a specific index.  This means they should specify the fields and sort order defined on a secondary index on the collection.

Filter parameters could be used to control the ordering but only options covered by indexes should be offered.  This may not be necessary if the number of documents in a collection is small.


## Guidance on pagination

If you need to extract a large volume of documents from a collection then it will be necessary to do it in pages.  There are various approaches but the most successful, and easiest to implement, is a mechanism based on a cursor.  This does not require the server to remember anything in between requests.

A good description on how to achieve this is provided as part of the GraphQL documentation on [Pagination](https://graphql.org/learn/pagination/).

To support pagination you'll need to create a doc type filter that expects a document id and a page size.  You then retrieve the documents from an id-ordered collection, wherever a candidates document id is greater than the given id, limited to the page size.  A client can then make multiple requests, supplying different cursor ids as they work through the collection.  You can also optionally support direction, allowing the client to iterate both forwards and backwards.


## Patching

The sengi engine will replace any field that is included in a patch.  If a field should be removed, then specify null.

A field is always replaced in it's entirety, you cannot replace part of a schema type field.  This makes it easier for clients to produce new values, without having to keep track of the individual changes made to parts of a field.  As a side effect, it means that null values can be stored within schema types if desired.


## Development

All packages in the monorepo are tested and versioned together.

The version number is only stored in the root package.json.  The version number is inserted into the child projects just before they are published by npm.  By not storing them at all, they cannot be out of sync.

All projects include tests written in Jest with 100% coverage.

To update dependencies, edit the respective `package.json` files, but then run `npm install` **in the root** of the project.  If you run it in a workspace folder a `node_modules` folder will be created which you'll then need to manually remove.


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.

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

It is much easier to supply valid `DocType` and `RoleType` objects if you use the Typescript definitions exported from `sengi-interfaces`.

## Doc Type

The Sengi system manages the creation, retrieval and mutation of JSON documents.  Each JSON document has a type that defines it's shape and the available operations.

Property | Description
---|---
name | The unique name of the doc type.
pluralName | The unique name of the doc type in plural form.  Some access patterns work better with a plural name, for example, a RESTful API for managing documents about books will use the plural name as follows: https://localhost:1234/docs/books?fields=author
title | The display name of the doc type.
pluralTitle | The display name of the doc type in plural form.
summary | A short summary of the doc type, typically a single line.
documentation | A markdown expression describing how to use the doc type.
fields | A `Record<string, DocTypeField>` of field definitions.  Each field can be marked as `isRequired`, `isArray` and `canUpdate`.  Each field must also be described in the markdown `documentation` field.
preSave | A function `(doc: Doc) => void` that is called prior to saving a document that can be used to perform cleanup.
validate | A function `(doc: Doc) => void` that is called prior to saving a document that can raise an error if the document is not valid and should not be saved.
examples | An array of example instances of the doc type with corresponding documentation.
patchExamples | An array of example merge patches that would be valid for this doc type with corresponding documentation.
calculatedFields | A `Record<string, DocTypeCalculatedField>` of fields that will be calculated from the declared fields on the document.  This will be updated whenever the document is saved regardless of whether the document is patched or mutated through an operation.  The resulting fields are saved as top-level fields.  If you change the implementation then existing documents will not reflect the new implementation until re-saved.
filters | A `Record<string, DocTypeFilter>` that provides a range of filters that can be used to return subsets of documents.  The required response from a filter implementation will depend on the choice of document store.
aggregates | A `Record<string, DocTypeAggregate>` that provides summary calculations across a whole set of documents.
ctor | A `DocTypeConstructor` that defines how to create a new instance of this doc type.  An implementation of `() => ({})` is fine where no special construction is required.  A client can always pass fields marked as `canUpdate` in addition to the defined constructor parameters.
operations | A `Record<string, DocTypeOperation>` that provides all the mutations that can be carried out server-side on a document.  An operation is useful where (a) you want to strictly control the types of mutation on a document, such as payment records, or (b) you want to allow rapid changes to a single field without clients patching it.
policy | A `DocTypePolicy` object that defines the types of permitted operations on the document.
docStoreOptions | A property bag that is passed to many of the document store operation callbacks.

When naming doc types, you may want to use dotted notation to include one or more containers in order to logically group doc types together.  For example, `automotive.car` and `automotive.boat`.

## Role Type

The Sengi system uses RoleType objects to determine the operations and document types that a user can manipulate.

Property | Description
---|---
name | The unique name of the role type.
title | The display name of the role type.
documentation | A markdown expression describing how to use the role type.
docPermissions | Either true or an object where each key names a doc type...
docPermissions[docType].query | Either true, or an object with `{ fieldsTreatment: 'whitelist'|'blacklist', fields: string[] }`.  If the `fieldsTreatmnt` property is `'whitelist'` then the `fields` property defines the fields that can be queried.  If the `fieldsTreatmnt` property is `'blacklist'` then the `fields` property defines the only fields that cannot be retrieved.
docPermissions[docType].update | Either true, or an object with `{ patch: boolean, operations: string[] }`.  If the `patch` property is true then the role can apply merge patches to the `docType`.  The `operations` property lists the specific operations the role may carry out on the `docType`.
docPermissions[docType].create | True if the role permits `docType` to be created.
docPermissions[docType].delete | True if the role permits `docType` to be deleted.
docPermissions[docType].replace | True if the role permits `docType` to be replaced.


## Field Types

Each Sengi field is given a type.  These types are validated using [Jsonotron](https://github.com/karlhulme/jsonotron).

You can define new enum and schema types using the JSON schema language and Sengi will use them.

This gives you extensive control over the shape of the field values in a Sengi document.


## Database Guidance

Document databases claim to be infinitely scalable but in practice documents will be divided up into physical sets.  Where possible, we want to query a single physical set as this will yield better performance than querying multiple physical sets.

To deal with this, we can consider most documents to be 1 of 2 possible types:


### An Authoritative Document

This document contains the largely normalised data for an entity.

The primary key is always a single unique id.  This ensures a good spread of documents across any logical or physical partitions created by the database while allowing us to access them with only one piece of information.

A **child authoritative document** is one that exists in a one-to-many relationship with a parent.  These records will need a secondary index on the field that links the child to the parent.  If the secondary index is actually a copy of the table (as per DynamoDB) then all keys (but not all fields) should be projected into this secondary index.


### A Warehouse Document

This document contains largely denormalised data.

Like the authoritative documents, they should be given a primary key of a single unique id.  This ensures Sengi can still find, edit and remove individual records - however this won't be the common access pattern.

A warehouse document will then be given secondary indexes that satisfy the access patterns of the client, including domain-specific partition keys.

This key should divide the data up into chunks, typically a few GB.  Geographic values like salesRegion or salesOffice often work well.  We're trying to avoid hot partitions and achieve an even spread of data.  Most challenging of all, the partition key needs to be something that is passed with every (or at least most) queries.

If you have a dataset for which no partition key makes sense, then you can store all the records in the same physical partition.  For example use a partition key of docType, which will be the same for every record.  You will need to monitor this dataset to ensure it doesn't exceed the limits of the database storage for a single partition.  Be conservative about the quantity of fields stored for each warehouse record to maximise the number of records that can be stored in this way.


### Synchronisation

To keep all the documents in sync you'll a mechanism that can write to multiple records in sequence in a fault-tolerant manner.  Crucially, if a second or third record needs to be updated but fails, you'll need a system that identifies these failed updates and provides a mechanism to retry or resume at a later point.  You don't want a system that silently fails and leads to increasing synchronisation issues.

[Piggle](https://github.com/karlhulme/piggle) is an appropriate framework for this.


## Guidance on Filters

Filters should generally hit a specific index.  This means they should specify the fields and sort order defined on a secondary index on the collection.

Filter parameters could be used to control the ordering but only options covered by indexes should be offered.  This may not be necessary if the number of documents in a collection is small.


## Guidance on Extracting Whole Collections

If you need to extract all the documents from a non-trivial collection then it will be necessary to do it sections.

To extract an entire collection, a client should use a filter to extract subsets of the data in multiple queries.  For example, query all the records named A-M, then query all the records N-Z.  The right strategy and the number of queries will depend on the size of the collection.  This approach is resilient to changes in the source collection.  You won't get duplicates and you won't be missing documents that were in the collection at the start of the extraction.  You may be missing documents that were added during the extraction (or holding documents removed during the extraction) but of course that can be resolved the next time the synchronisation takes place.

Skip and Limit are included as a convenience but should not be used for enumerating through "pages" of a collection.  This is not reliable because the collection can change between requests.  Imagine you ask for the first 10 records.  Then an additional 3 records get inserted into the database at the front.  Records previously at index 8, 9 and 10 are now at index 11, 12 and 13.  So if you request records 11-20 you'll get duplicates.  Databases do not guarantee the order of documents, so omitting a search order will not help.  It also isn't performant because implementations at the database level will often involve walking the entire result set so skip/limit will take longer and longer to run as the numbers get larger.  For this reason, some databases (e.g. AWS DynamoDO) don't provide any support for Offset. 


## Patching

The sengi engine will replace any field that is included in a patch.  If a field should be removed, then specify null.

A field is always replaced in it's entirety, you cannot replace part of a schema type field.  This makes it easier for clients to produce new values, without having to keep track of the individual changes made to parts of a field.  As a side effect, it means that nulls value can be stored within schema types if desired.


## Development

All packages in the monorepo are tested and versioned together.

The version number is only stored in the root package.json.  The version number is inserted into the child projects just before they are published by npm.  By not storing them at all, they cannot be out of sync.

All projects include tests written in Jest with 100% coverage.


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.

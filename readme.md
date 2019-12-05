# Jsonotron

Provides a schema-centric interface to a document-based database.

## All Inclusive

All of the interface options are bundled together.  This has the following advantages:

* It's easier to setup Jsonotron because everything except the document store is included.
* The Jsonotron engine and the interfaces to it tend to evolve together.  This reduces release friction and allows users to just update one package.
* No need to separate out an errors package to be depended upon.

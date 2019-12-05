# Jsonotron

You define a JSON schema for a domain object, e.g. Customer, along with any methods required to construct or mutate it, all in a single file.  This is analogous to a table definition in SQL.  You then connect Jsonotron to a doc store like CosmosDB or MongoDB and to an interface like Express.  You end up with an end-to-end data microservice, similar to an installed DB product, but all config/code is native JS, versioned, evolvable, and ready for your CI process.

## Example

Start with the fields of your domain object.

Then you can add some calculated fields.

Then define a constructor and any operations (mutators).


Then instantiate the jsonotron engine and connect it to a doc store and an interface.
 



## All Inclusive

All of the interface options are bundled together.  This has the following advantages:

* It's easier to setup Jsonotron because everything except the document store is included.
* The Jsonotron engine and the interfaces to it tend to evolve together.  This reduces release friction and allows users to just update one package.
* No need to separate out an errors package to be depended upon.

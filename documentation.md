# Overview

Jsonotron is...
* a small set of components for building a **NodeJS microservice**
* for storing, patching and querying **JSON documents**
* stored in a schemaless/NoSQL **database**
* that have known, enforceable, and **evolving schemas**.

# Example

Suppose you plan to create an application for running a Veterinary Practice.

You're storing your data in a NoSQL database because of the ease of use and massive scalability.

A JSON Document for a pet might look like...

```JSON
{
  "name": "fido",
  "animalType": "dog",
  "dateOfBirth": "2019-11-15",
  "medicalChecks": ["2019-11-30", "2019-12-01"]
}
```

The first step is to define a **docType** definition for a pet...

```javascript
const petDocType = {
  name: 'pet',
  pluralName: 'pets',
  title: 'Pet',
  pluralTitle: 'Pets',
  fields: {
    name: { type: 'shortString', isRequired: true, canUpdate: true, description: 'The pet\'s name.' },
    animalType: { type: 'mediumString', isRequired: true, canUpdate: true, description: 'The type of animal.' },
    dateOfBirth: { type: 'date', canUpdate: true, description: 'The date of birth.' },
    medicalChecks: { type: 'date', isRequired: true, isArray: true, description: 'The date of birth.' }
  }
}
```

It's common to need the date of the last medical check, so we'll make that a calculated field... 

```javascript
petDocType.calculatedFields = {
  lastMedicalCheck: {
    description: 'The date that the pet had their last medical.',
    inputFields: ['medicalChecks'],
    value: data => data.medicalChecks.reduce((agg, cur) => Math.max(agg, cur), 0)
  }
}
```

A constructor allow consumers to create a new pet by providing only 3 fields, and we'll use a default for the 4th...

```javascript
petDocType.ctor = {
  parameters: {
      name: { lookup: 'field', isRequired: true },
      animalType: { lookup: 'field' },
      dateOfBirth: { lookup: 'field', isRequired: true }
    },
    implementation: input => {
      return {
        name: input.name,
        animalType: input.animalType || 'dog',
        dateOfBirth: input.dateOfBirth,
        medicalChecks: []
      }
    }
}
```

We don't want consumers patching the `medicalChecks` field directly because they might remove a previous check.  So instead we define an operation that just adds new dates into the array...

```javascript
petDocType.operations = {
  addMedicalCheck: {
    title: 'Add Medical Check',
    description: 'Make a record of the latest medical check.',
    parameters: {
      newMedicalCheck: { type: 'date', isRequired: true }
    },
    implementation: (doc, input) => ({
      medicalChecks: [...doc.medicalChecks, input.newMedicalCheck]
    })
  }
}
```

Finally, we'll add a filter that allows consumers to query for pets based on their year of birth.  A filter implementation should return whatever is required by the backing store, such as a SQL where clause.  In this case our backing store is an in-memory database so we return a javascript function.

```javascript
petDocType.filters = {
  byYearOfBirth: {
    description: 'Fetch pets based on their year of birth.',
    parameters: {
      year: { type: 'integer', isRequired: true, description: 'A year.' }
    },
    implementation: input => d => Number(d.dateOfBirth.substring(0, 4)) === input.year
  }
}
```

> Remember it's all just javascript, so you can define operations, filters and constructors in separate files if that makes it easier to read and/or test.

Then instantiate the jsonotron engine, using whatever platform is good for you, and connect it to a doc store.

```javascript
const { createJsonotronExpress } = require('jsonotron-express')
const { createMemDocStore } = require('jsonotron-memdocstore')
const uuid = require('uuid/v4')

const docs = []
const memDocStore = createMemDocStore(docs, uuid)

// need to show how to define roleType and docTypes and pass them in here.
// also need to show how to create custom field types.
const jsonotronExpress = createJosotronExpress({}, [], [])
```

# A Database

Jsonotron sits in front of your NoSQL database.

#### Enforce Schema in a New Way

Jsonotron reintroduces schema - in this case JSON schema.

But the schemas exist in your code, not as config on your database.  That means:
* You can create your schemas in parts and combine it any way permitted by the Javascript language.
* It easy to test using your preferred test tool, e.g. Mocha, Jest
* You don't need any *database deployment scripts*.  Instead, you just deploy your updated microservice.


#### Control All Document Updates

Jsonotron also introduces constructors and mutators.  Similar to schema, you don't want these setup in your database layer because it's application logic.  Instead, you want them in the code of your microservice so they can be evolved over time.

The logic is expressed as more javascript.

## Architecture

Consumers can call the microservice directly but in a typical large-scale deployment, with some degree of command query separation, the data flow looks like this:

#### Read Request

Consumer ---> GraphQL Server ---> Jsonotron Microservice ---> MongoDB/Azure Cosmos/Amazon DynamoDB

#### Write Request

Consumer ---> Service Bus ---> Workflow Worker ---> Jsonotron Microservice ---> MongoDB/Azure Cosmos/Amazon DynamoDB

## Document Type Definition

A **docType** consists of the following sections:

|Section|Description|
|---|---|
|Name|Expressed in both single and plural form.|
|Fields and their types|Just like a database but with support for arrays and keyed objects.  Each named field type has it's own JSON schema for field value validation.  There are lots included as standard and you can define your own.|
|Calculated Fields|Common summations/reductions on the data, as required or commonly performed by consumers, can be declared directly on the model.|
|Constructor|A function, with defined inputs, that generates a new document.|
|Operations|A range of mutators that allow you to control how the underlying document can be amended.  This is optional, as you can also designate individual fields as patchable and let consumers update them at will.|
|Validate|A custom function that can determine if the document resulting from a patch or operation is valid.  This function can consider multiple fields, useful if two separate fields might contain valid values but not be considered acceptable if used together.|

All of the sections include desciptive text so that documentation production can be automated.

The resulting service uses idempotent messages for creation and updating (as well as querying).  This means if a consumer receives an error, it can safely try again.

# Jsonotron

![](https://github.com/karlhulme/jsonotron/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/jsonotron.svg)](https://www.npmjs.com/package/jsonotron)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A component set for rapidly building a RESTful microservice in NodeJS for storing and querying JSON documents that have a known enforced schema, but are stored in a schemaless database.

Everything is defined in code.  You can add new objects and evolve existing ones by updating your coded definitions, running your tests and redeploying your microservice.

Crucially, you **don't** need to change the config of your database.

## Getting Started

Begin by creating a definition for a business entity that you want to store.  For example, a Pet.

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

Then you can add some calculated fields.  When querying the database, you can treat calculated fields like regular fields.

```javascript
petDocType.calculatedFields = {
  lastMedicalCheck: {
    description: 'The date that the pet had their last medical.',
    inputFields: ['medicalChecks'],
    value: data => data.medicalChecks.reduce((agg, cur) => Math.max(agg, cur), 0)
  }
}
```

Define a constructor to make it easy to create records.

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

Fields marked with `canUpdate: true` can be adjusted with a patch command.  For anything else, define operations to mutate the data.

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

Remember it's all just javascript, so you can define operations, filters and constructors in separate files if that makes it easier to read and/or test.

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

## Development

Code base adheres to the rules chosen by https://standardjs.com/.  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascript
npm test
```

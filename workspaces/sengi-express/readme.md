# Sengi-Express

[![npm](https://img.shields.io/npm/v/sengi-express.svg)](https://www.npmjs.com/package/sengi-express)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

An ExpressJS RESTful host for [Sengi](https://github.com/karlhulme/sengi).

## Installation

```bash
npm install sengi-express
```

## Usage

```javascript
import { createMemDocStore } from 'sengi-memdocstore'
import { createSengiExpress } from 'sengi-express'

const docTypes = []
const roleTypes = []

const memDocStore = createMemDocStore(docs, uuid)
const sengiExpress = createSengiExpress({
  docStore: memDocStore,
  docTypes,
  roleTypes
})

const app = express()
app.use(bodyParser.json())
app.use('/sengi', sengiExpress)
```

## Constructor

To instantiate a sengi-express server you can use the following parameters:

* **docStore** - (Required) A document store implementation such as sengi-memdocstore, sengi-cosmosdb or sengi-mongodb.

* **docTypes** - (Required) An array of document type definitions.

* **roleTypes** - (Required) An array of role type definitions.

* **enumTypes** - An array of enum type definitions.

* **schemaTypes** - An array of schema type definitions.

* **additionalComponentsCount** - The number of additional components to be expected between the /docs and /docTypeName component parts of the request url.

* **uuid** - A function that generates a unique identifier, used for ensuring uniqueness of operations and patches.  If not supplied then the uuid/v4 package is used by default.

* **logger** - A function that is passed an object with status, text, internalText, json and header properties that will be used to compose the response.  If not supplied, then responses with a status of 500 or higher will be logged to stdout.

* **handler** - A function that overrides the handler used to process the response.  This is used by the testing framework.

You can also specify functions that are used on each request.  This functions are:

* **getRequestRoles** - A function that should return the roles held by the requesting user.

* **getRequestUserIdentity** - A function that should return the user identity for the requesting user.

* **getRequestProps** - A function that should return a property bag that is passed to the document store as the request properties.  This can be used for per-request custom processing that the document store understands.

* **createDocStoreOptions** - A function should return an object that will be passed to the document store.  The response will be combined with the docStoreOptions for the matched document store.

Each of these methods will be passed an object with the following properties:

Property Name | Description
---|---
path | The url requested.
headers | A property bag of headers specified in the request.  One key per header.
matchedPathType | A constant value that indicates the type of request that was made.
urlParams | A property bag of parameters pulled from the url.  One key per url parameter.


## Routes

A SengiExpress mounted at the `/root` path would make a number of different routes accessible.

To retrieve all documents in a collection:

`GET https://server.com/sengi/<docTypePluralName>?fields=a,b,c`

To retrieve a subset documents from a collection:

`GET https://server.com/sengi/<docTypePluralName>?fields=a,b,c&filterName=myFilter&filterParams={"foo":"bar"}`

To create a new document, post constructor parameters to:

`POST https://server.com/sengi/<docTypePluralName>`

To access a single document:

`GET https://server.com/sengi/<docTypePluralName>/<id>?fields=a,b,c`

To update a document, send new field values:

`PATCH https://server.com/sengi/<docTypePluralName>/<id>`

To excute an operation, send operation parameters to:

`POST https://server.com/sengi/<docTypePluralName>/<id>:<operationName>`

To delete a document:

`DELETE https://server.com/sengi/<docTypePluralName>/<id>`

## Development

Code base adheres to the rules chosen by [StandardJS](https://standardjs.com).  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascript
npm test
```

At present the test framework `jest` does not fully support the package.json `exports` property.  This means it cannot load the `uuid` library via ESM properly.  For the moment I'm importing the required function using the CommonJS format in a separate .cjs file.

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.

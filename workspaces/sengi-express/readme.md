# Sengi Express

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-express.svg)](https://www.npmjs.com/package/sengi-express)

An ExpressJS RESTful host for a Sengi-based document service.

This modules provides a `createSengiExpress` function that returns an Express Request handler that you can mount using `app.use`.

## Installation

```bash
npm install sengi-express
```

## Usage

```javascript
import { MemDocStore } from 'sengi-docstore-mem'
import { createSengiExpress } from 'sengi-express'
import { v4 } from 'uuid'

const docTypes = [] // import implementations of DocType interface
const roleTypes = [] // import implementations of RoleType interface
const jsonotronTypes = [] // load from YAML files

const memDocStore = new MemDocStore({ docs, generateDocVersionFunc: v4 })
const sengiExpress = createSengiExpress({
  docStore: memDocStore,
  docTypes,
  roleTypes,
  jsonotronTypes
})

const app = express()
app.use(bodyParser.json())
app.use('/', sengiExpress)
```

## Constructor

To instantiate a sengi-express server you pass the constructor parameters defined for a [sengi-engine](https://github.com/karlhulme/sengi/blob/master/workspaces/sengi-engine/readme.md#constructor) plus the following additional properties:

* **additionalComponentsCount** - The number of additional components to be expected between the /docs and /docTypeName component parts of the request url.  This can be used for capturing additional url parameters (e.g. tenant id).

* **getDocStoreOptions** - A function that returns an object that will be provided to the DocStore and included in DocStore callbacks.

* **getRequestOptions** - A functino that returns an object that will be provided to the Sengi Engine and included in Sengi Engine callbacks.

* **getUuid** - A function that generates a unique identifier, used for ensuring uniqueness of operations and patches.  If not supplied then the uuid/v4 package is used by default.

The `getDocStoreOptions` and `getRequestOptions` callbacks will be passed a `SengiExpressCallbackProps` object.  This contains the following properties:

* **headers** - An object where each key name is a header name and each value is the corresponding header value sent with a request.

* **path** - The path of the request.

* **matchedResourceType** - The type of resource that was matched from the `RestResourceType` enum.

* **method** - The method of the request, e.g. GET, POST, etc

* **urlParams** - The parameters pulled from the url as a consequence of matching the resource type.  Possible keys are `adc`, `docTypePluralName`, `id` and `operationName`.


## Routes

A SengiExpress mounted at the `/root` path would make a number of different routes accessible.

### To retrieve all documents in a collection:

`GET https://server.com/sengi/docs/<docTypePluralName>?fields=a,b,c`

*(This route all supports the offset and limit query parameters, although this is not supported by all doc stores)*

### To retrieve a subset of documents from a collection using a filter:

`GET https://server.com/sengi/docs/<docTypePluralName>?fields=a,b,c&filterName=myFilter&filterParams={"foo":"bar"}`

### To retrieve a subset of documents from a collection by specifying id's:

`GET https://server.com/sengi/docs/<docTypePluralName>?fields=a,b,c&ids=1234,5678`

### To create a new document, post constructor parameters to:

`POST https://server.com/sengi/docs/<docTypePluralName>`

### To access a single document:

`GET https://server.com/sengi/docs/<docTypePluralName>/<id>?fields=a,b,c`

### To update a document, send new field values:

`PATCH https://server.com/sengi/docs/<docTypePluralName>/<id>`

### To execute an operation, send operation parameters to:

`POST https://server.com/sengi/docs/<docTypePluralName>/<id>:<operationName>`

### To patch a document, send a merge patch object to:

`PATCH https://server.com/sengi/docs/<docTypePluralName>/<id>`

### To delete a document:

`DELETE https://server.com/sengi/<docTypePluralName>/<id>`


## Development

Tests are written using Jest with 100% coverage.

```javascript
npm test
```


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
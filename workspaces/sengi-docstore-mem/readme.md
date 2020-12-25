# Sengi DocStore Mem

> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-docstore-mem.svg)](https://www.npmjs.com/package/sengi-docstore-mem)

An in-memory implementation of the Sengi document store interface.

## Installation

```bash
npm install sengi-docstore-mem
```

## Usage

The `MemDocStore` implements the DocStore interface defined in sengi-interfaces.

To instantiate a `MemDocStore` you have to provide the following parameters:

* **docs** - An array of `Doc` objects.

* **generateDocVersionFunc** - A function `() => string` that returns a string of random characters.

```javascript
const memDocStore = new MemDocStore({
    docs: [],
    generateDocVersionFunc: () => crypto.randomBytes(Math.ceil(10)).toString('hex').slice(0, 20)
  })
```

This example uses the standard NodeJs `crypto` library to produce a string of 20 random hex characters for `generateDocVersionFunc`.


## Filters

Filter expressions are expected to be a function `(doc: Doc) => Boolean` that returns true if the filter is a match, or false otherwise.

This is an example filter expression returned from a DocType filter implementation:

```javascript
const filterExpression = d => d.heightParam > 200
```

## Limitations

This provider will not persist any changes because all the operations occur on a `Doc`'s array in-memory.

This provider does not support indexes and cannot be scaled to multiple nodes.

It is great for testing purposes but probably not useful in production.


## Development

Tests are written using Jest with 100% coverage.

```bash
npm test
```


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.

# Sengi Interfaces
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-interfaces.svg)](https://www.npmjs.com/package/sengi-interfaces)

A set of **interfaces**, **types**, **function signatures**, **callback signatures** and **errors** used by the packages of the Sengi system.


## Installation

```bash
npm install sengi-interfaces
```


## Check

There are no tests for the interface definitions.  You can produce a build to check validity.

```
npm run build
```


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
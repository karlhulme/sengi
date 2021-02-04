# Sengi CLI

A command-line for interacting with a Sengi-based data service that is using the Express wrapper.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/jsonocli.svg)](https://www.npmjs.com/package/sengi-cli)
![npm type definitions](https://img.shields.io/npm/types/typescript)


## Installation

```bash
npm install sengi-cli
```

## Commands

Command | Output
--- | ---
npm start | Show the help output
npm start clone -- --help | Show the help output for the clone command
npm start clone http://localhost:3002 root ./temp/folder | Clone the doc types to a local JSON file


## Development

This repo does not contain any tests at this time.

To publish an ES5 transpiled version (with typescript definitions) to npm:

```bash
npm run build
npm publish
```


## Continuous Deployment

Any pushes or pull-requests on non-main branches will trigger the test runner.

Any pushes to main will cause a release to be created on Github.

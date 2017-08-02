# aenigma
[![Build Status](https://travis-ci.org/ArminTamzarian/aenigma.svg?branch=master)](https://travis-ci.org/ArminTamzarian/aenigma)
[![codecov](https://codecov.io/gh/ArminTamzarian/aenigma/branch/master/graph/badge.svg)](https://codecov.io/gh/ArminTamzarian/aenigma)
[![npm version](https://badge.fury.io/js/aenigma.svg)](http://badge.fury.io/js/aenigma)
[![devDependency Status](https://david-dm.org/ArminTamzarian/aenigma/dev-status.svg)](https://david-dm.org/ArminTamzarian/aenigma?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/ArminTamzarian/aenigma.svg)](https://github.com/ArminTamzarian/aenigma/issues)
[![GitHub stars](https://img.shields.io/github/stars/ArminTamzarian/aenigma.svg)](https://github.com/ArminTamzarian/aenigma/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ArminTamzarian/aenigma/master/LICENSE)

## Demo
https://ArminTamzarian.github.io/aenigma/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About



## Installation

Install through npm:
```
npm install --save aenigma
```

Then include in your apps module:

```typescript
import { NgModule } from '@angular/core';
import { AenigmaModule } from 'aenigma';

@NgModule({
  imports: [
    AenigmaModule.forRoot()
  ]
})
export class MyModule {}
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: '<hello-world></hello-world>'
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/ArminTamzarian/aenigma/blob/master/demo/demo.component.ts).

### Usage without a module bundler
```
<script src="node_modules/aenigma/bundles/aenigma.umd.js"></script>
<script>
    // everything is exported aenigma namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://ArminTamzarian.github.io/aenigma/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT

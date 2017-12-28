# aenigma

User-friendly [AngularJS](https://angularjs.org/) encryption module utilizing the [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/) and providing an extensible secure secret storage mechanism.

[![Build Status](https://travis-ci.org/ArminTamzarian/aenigma.svg?branch=master)](https://travis-ci.org/ArminTamzarian/aenigma)
[![codecov](https://codecov.io/gh/ArminTamzarian/aenigma/branch/master/graph/badge.svg)](https://codecov.io/gh/ArminTamzarian/aenigma)
[![npm version](https://badge.fury.io/js/aenigma.svg)](http://badge.fury.io/js/aenigma)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ArminTamzarian/aenigma/master/LICENSE)

## Getting Started

### Installation

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

You may also find it useful to view the [demo source](https://github.com/ArminTamzarian/aenigma/blob/master/demo/demo.view.ts).

### Installation (without a module bundler)
```html
<script src="node_modules/aenigma/bundles/aenigma.umd.js"></script>
<script>
    // everything is exported aenigma namespace
</script>
```

## Usage

### Set up the desired `AenigmaStorageProvider` implementation

```typescript
@NgModule({
  imports: [
    AenigmaModule.forRoot()
  ],
  providers: [
    AenigmaLocalStorageProvider
  ]
})
```

### Inject the `AenigmaStorageProvider` implementation into your component

```typescript
constructor(private _encryptedStorageProvider: AenigmaLocalStorageProvider) { }
```

### In your component create your `Aenigma` object

```typescript
constructor(private _encryptedStorageProvider: AenigmaLocalStorageProvider) {

  Aenigma.create().subscribe(
    (aenigma: Aenigma) => {
      this._aenigma = aenigma;
    },
    error => {
      console.error(error);
    }
  );
}
```

### Use the Aenigma object to initialize the `AenigmaStorageService` object

```typescript
constructor(private _encryptedStorageProvider: AenigmaLocalStorageProvider) {

  Aenigma.create().subscribe(
    (aenigma: Aenigma) => {
      this._aenigma = aenigma;
      this._encryptedStorage = new AenigmaStorageService(
        this._aenigma,
        this._encryptedStorageProvider
      );
    },
    error => {
      console.error(error);
    }
  );
}
```

### Use the `Aenigma` object to encrypt/decrypt data
```typescript
this._aenigma
  .encrypt(plaintext)
  .subscribe((encrypted: EncryptedValue) => {
    console.log(encrypted.stringify());
  });
```

```typescript
this._aenigma
  .decrypt(EncryptedValue.parse(cipher))
  .subscribe((decrypted: string) => {
    this._plaintext = decrypted;
  });
```

### Use the `AenigmaStorageService` implementation to store/retrieve encrypted data

```typescript
this._encryptedStorage
  .store('supersecret', 'secret_id')
  .subscribe((encrypted: EncryptedValue) => {
    console.log(encrypted.stringify());
  });
```

```typescript
this._encryptedStorage
  .retrieve('secret_id')
  .subscribe((plaintext: string) => {
    console.log(plaintext);
  });
```

## Development

### Prepare your environment

Install [Node.js](http://nodejs.org/) and NPM

Install local dev dependencies: `npm install` while current directory is this repo

### Development server

Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing

Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Documentation

Library and API documentation is available at https://armintamzarian.github.io/aenigma/

## License

(The MIT License)

Copyright (c) 2017 Armin Tamzarian

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

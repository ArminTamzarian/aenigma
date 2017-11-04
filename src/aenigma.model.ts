import { Observer } from 'rxjs/Observer';

import { Observable } from 'rxjs/Observable';

import { AenigmaUtil } from './aenigma.util';

export class Credentials {
  public static readonly algorithm = 'AES-GCM';
  public static readonly FORMAT: string = 'jwk';

  private _key: JsonWebKey;

  public static generate(keyLength = 256): Observable<Credentials> {
    function generateKey(observer: Observer<Credentials>): Promise<void> {
      return (<Promise<CryptoKey>>window.crypto.subtle.generateKey(
        {
          name: Credentials.algorithm,
          length: keyLength
        },
        true,
        ['encrypt', 'decrypt']
      ))
        .then((key: CryptoKey) => {
          return window.crypto.subtle.exportKey(Credentials.FORMAT, key);
        })
        .then((key: JsonWebKey) => {
          observer.next(new Credentials(key));
        })
        .catch((error: any) => {
          observer.error(error.message);
        });
    }

    return Observable.create(generateKey);
  }

  public static import(jwk: JsonWebKey): Observable<Credentials> {
    function importKey(observer: Observer<Credentials>): Promise<void> {
      return (<Promise<
        CryptoKey
      >>window.crypto.subtle.importKey(
        Credentials.FORMAT,
        jwk,
        {
          name: Credentials.algorithm
        },
        true,
        ['encrypt', 'decrypt']
      ))
        .then((key: CryptoKey) => {
          return window.crypto.subtle.exportKey(Credentials.FORMAT, key);
        })
        .then((key: JsonWebKey) => {
          observer.next(new Credentials(key));
        })
        .catch((error: any) => {
          observer.error(error.message);
        });
    }

    return Observable.create(importKey);
  }

  constructor(key: JsonWebKey) {
    this._key = key;
  }

  get key(): JsonWebKey {
    return this._key;
  }
}

export class EncryptedValueJson {
  constructor(public data: string, public iv: string) {}
}

export class EncryptedValue {
  public static parse(json: string): EncryptedValue {
    const encryptedValueJson: EncryptedValueJson = <EncryptedValueJson>JSON.parse(
      json
    );

    return new EncryptedValue(
      AenigmaUtil.stringToArrayBuffer(encryptedValueJson.data),
      new Uint8Array(AenigmaUtil.stringToArrayBuffer(encryptedValueJson.iv))
    );
  }

  constructor(public data: ArrayBuffer, public iv: Uint8Array) {}

  public stringify(): string {
    return JSON.stringify(
      new EncryptedValueJson(
        AenigmaUtil.arrayBufferToString(this.data),
        AenigmaUtil.arrayBufferToString(this.iv.buffer)
      )
    );
  }
}

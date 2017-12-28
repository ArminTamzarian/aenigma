import { Observer } from 'rxjs/Observer';

import { Observable } from 'rxjs/Observable';

import { AenigmaUtil } from './aenigma.util';

/**
 * Class to generate and manage encryption credentials for the aenigma library.
 */
export class Credentials {
  public static readonly ALGORITHM: string = 'AES-GCM';
  public static readonly BLOCK_SIZE: number = 16;
  public static readonly FORMAT: string = 'jwk';

  private _key: JsonWebKey;

  /**
   * Generate a new encryption credentials and initialze a {@link Credentials} object to manage them
   *
   * @param keyLength optional length in bytes for the encryption key (default: 256)
   *
   * @returns `Observable` containing the newly generated `Credentials` object
   */
  public static generate(keyLength = 256): Observable<Credentials> {
    function generateKey(observer: Observer<Credentials>): Promise<void> {
      return (<Promise<CryptoKey>>window.crypto.subtle.generateKey(
        {
          name: Credentials.ALGORITHM,
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

  /**
   * Import a previously generated {@link https://tools.ietf.org/html/rfc7517|JsonWebKey} credentials and initialze a {@link Credentials} object to manage them
   *
   * @param jwk a previously generated representation of a `JsonWebKey` object
   *
   * @returns `Observable` containing the newly generated `Credentials` object
   */
  public static import(jwk: JsonWebKey): Observable<Credentials> {
    function importKey(observer: Observer<Credentials>): Promise<void> {
      return (<Promise<
        CryptoKey
      >>window.crypto.subtle.importKey(
        Credentials.FORMAT,
        jwk,
        {
          name: Credentials.ALGORITHM
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

  /**
   * Protected tandard constructor for the `Credentials` class
   *
   * __Note:__ This constructor should not be instantiated directly and should instead be delegated through the `Credentials.import` interface
   *
   * @param jwk a `JsonWebKey` object exported through the Web Cryptography `exportKey` functionality
   */
  private constructor(key: JsonWebKey) {
    this._key = key;
  }

  get key(): JsonWebKey {
    return this._key;
  }
}

/**
 * Class representing the JSON properties of an {@Link EncryptedValue} object
 */
export class EncryptedValueJson {
  /**
   * @param data  base64 representation of the encrypted data
   * @param iv  base64 representation of the encrypted data's initialization vector
   */
  constructor(public data: string, public iv: string) {}
}

/**
 * Class to manage and store the values of encrypted data
 */
export class EncryptedValue {
  /**
   * Parse the JSON representaiton of an {@link EncryptedValue} object
   *
   * @param json  JSON representation of an `EncryptedValue`
   *
   * @returns `EncryptedValue` object for the provided JSON data
   */
  public static parse(json: string): EncryptedValue {
    const encryptedValueJson: EncryptedValueJson = <EncryptedValueJson>JSON.parse(
      json
    );

    return new EncryptedValue(
      AenigmaUtil.base64ToArrayBuffer(encryptedValueJson.data),
      new Uint8Array(AenigmaUtil.base64ToArrayBuffer(encryptedValueJson.iv))
    );
  }

  /**
   * Standard constructor for the {@link EncryptedValue} class
   *
   * __Note:__ Under normal usage this constructor should not be instantiated directly and should instead be delegated through the `EncryptedValue.parse` interface
   *
   * @param data  encrypted data buffer
   * @param iv  encrypted data initialization vector array
   */
  constructor(public data: ArrayBuffer, public iv: Uint8Array) {}

  /**
   * Generates a JSON string representation for this {@link EncryptedValue} object
   *
   * @return  JSON string representation for the `EncryptedValue` object
   */
  public stringify(): string {
    return JSON.stringify(
      new EncryptedValueJson(
        AenigmaUtil.arrayBufferToBase64(this.data),
        AenigmaUtil.arrayBufferToBase64(this.iv.buffer)
      )
    );
  }
}

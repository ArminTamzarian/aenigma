import { Observer } from 'rxjs/Observer';

import { Observable } from 'rxjs/Observable';

import { Credentials, EncryptedValue } from './aenigma.model';

import { AenigmaUtil } from './aenigma.util';

/**
 *
 */
export class Aenigma {
  private static _create(credentials: Credentials): Observable<Aenigma> {
    function create(observer: Observer<Aenigma>): PromiseLike<void> {
      return (<Promise<
        CryptoKey
      >>window.crypto.subtle.importKey(
        Credentials.FORMAT,
        credentials.key,
        {
          name: Credentials.ALGORITHM
        },
        true,
        ['encrypt', 'decrypt']
      ))
        .then((key: CryptoKey) => {
          observer.next(new Aenigma(credentials, key));
        })
        .catch((error: any) => {
          observer.error(error.message);
        });
    }

    return Observable.create(create);
  }

  /**
   * Instantiate a new instance of the `Aenigma` encryption management object
   *
   * @param credentials Optional `Credentials` object used for encryption and decryption routines. If no object is provided a new one will be created.
   *
   * @return  Observable containing the newly instatiated `Aenigma` object
   */
  public static create(credentials?: Credentials): Observable<Aenigma> {
    if (credentials) {
      return Aenigma._create(credentials);
    } else {
      return Credentials.generate().mergeMap(
        (newCredentials: Credentials): Observable<Aenigma> => {
          return Aenigma._create(newCredentials);
        }
      );
    }
  }

  /**
   * Protected tandard constructor for the `Aenigma` class
   *
   * __Note:__ This constructor should not be instantiated directly and should instead be delegated through the `Aenigma.create` interface
   *
   * @param _credentials a `Credentials` object with associated encryption credentials
   * @param _key a `CryptoKey` object which is used to perform the actual encryption and decryption of data
   */
  private constructor(
    protected _credentials: Credentials,
    protected _key: CryptoKey
  ) {}

  get credentials(): Credentials {
    return this._credentials;
  }

  /**
   * Encrypt the provided data
   *
   * @param data  Javascript string data to encrypt
   *
   * @return  Observable containing the `EncryptedValue` representing the encrypted state of the provided data
   */
  public encrypt(data: string): Observable<EncryptedValue> {
    const context = this;

    return Observable.create((observer: Observer<EncryptedValue>): PromiseLike<
      void
    > => {
      const iv: Uint8Array = new Uint8Array(Credentials.BLOCK_SIZE);
      window.crypto.getRandomValues(iv);

      return (<Promise<ArrayBuffer>>window.crypto.subtle.encrypt(
        {
          name: Credentials.ALGORITHM,
          iv
        },
        context._key,
        AenigmaUtil.stringToArrayBuffer(data)
      ))
        .then((encrypted: ArrayBuffer) => {
          observer.next(new EncryptedValue(encrypted, iv));
        })
        .catch((error: any) => {
          observer.error(error.message);
        });
    });
  }

  /**
   * Decrypt the provided value
   *
   * @param value  `EncryptedValue` representing the encrypted state of the data
   *
   * @return  Observable containing decrypted value of the data
   */
  public decrypt(value: EncryptedValue): Observable<string> {
    const context = this;

    return Observable.create((observer: Observer<string>): PromiseLike<
      void
    > => {
      return (<Promise<ArrayBuffer>>window.crypto.subtle.decrypt(
        {
          name: Credentials.ALGORITHM,
          iv: value.iv
        },
        context._key,
        value.data
      ))
        .then((decrypted: ArrayBuffer) => {
          observer.next(AenigmaUtil.arrayBufferToString(decrypted));
        })
        .catch((error: any) => {
          observer.error(error.message);
        });
    });
  }
}

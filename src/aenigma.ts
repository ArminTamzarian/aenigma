import { Observer } from 'rxjs/Observer';

import { Observable } from 'rxjs/Observable';

import { Credentials, EncryptedValue } from './aenigma.model';

import { AenigmaUtil } from './aenigma.util';

export class Aenigma {
  private static _create(credentials: Credentials): Observable<Aenigma> {
    function create(observer: Observer<Aenigma>): PromiseLike<void> {
      return (<Promise<
        CryptoKey
      >>window.crypto.subtle.importKey(
        Credentials.FORMAT,
        credentials.key,
        {
          name: Credentials.algorithm
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

  private constructor(
    protected _credentials: Credentials,
    protected _key: CryptoKey
  ) {}

  get credentials(): Credentials {
    return this._credentials;
  }

  public encrypt(data: string): Observable<EncryptedValue> {
    const context = this;

    return Observable.create((observer: Observer<EncryptedValue>): PromiseLike<
      void
    > => {
      const iv: Uint8Array = new Uint8Array(12);
      window.crypto.getRandomValues(iv);

      return (<Promise<ArrayBuffer>>window.crypto.subtle.encrypt(
        {
          name: Credentials.algorithm,
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

  public decrypt(value: EncryptedValue): Observable<string> {
    const context = this;

    return Observable.create((observer: Observer<string>): PromiseLike<
      void
    > => {
      return (<Promise<ArrayBuffer>>window.crypto.subtle.decrypt(
        {
          name: Credentials.algorithm,
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

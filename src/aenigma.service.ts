import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Observer } from 'rxjs/Observer';

import 'rxjs/Rx';

import { Aenigma } from './aenigma';

import { Credentials, EncryptedValue } from './aenigma.model';

/**
 * Abstract class to implement storage providers for the aenigma library
 *
 * See {@link AenigmaLocalStorageProvider}
 */
export abstract class AenigmaStorageProvider {
  /**
   * Store an {@link EncryptedValue} using the provided identifier
   *
   * @param data  `EncryptedValue` object to store
   * @param identifier  identifier to reference the provided data
   *
   * @return `Observable` containing the stored `EncryptedValue`
   */
  public abstract store(
    data: EncryptedValue,
    identifier: string
  ): Observable<EncryptedValue>;

  /**
   * Retrieve an {@link EncryptedValue} using the provided identifier
   *
   * @param identifier  identifier to reference the provided data
   *
   * @return `Observable` containing the retrieved `EncryptedValue`
   */
  public abstract retrieve(identifier: string): Observable<EncryptedValue>;
}

/**
 * Service utilizing the provided {@link Aenigma} encryption object and {@link AenigmaStorageProvider}
 * to perform storage and retrieval of encrypted data
 */
@Injectable()
export class AenigmaStorageService {
  /**
   * @param _aenigma  `Aenigma` encryption object to utilize for encryption and decryption of values
   * @param _storageProvider  `AenigmaStorageProvider` implementation to perform secure storage and retrieval of values
   */
  public constructor(
    private _aenigma: Aenigma,
    private _storageProvider: AenigmaStorageProvider
  ) {}

  /**
   * Store an {@link EncryptedValue} using the provided identifier
   *
   * @param data  `EncryptedValue` object to store
   * @param identifier  identifier to reference the provided data
   *
   * @return `Observable` containing the stored `EncryptedValue`
   */
  public store(data: string, identifier: string): Observable<EncryptedValue> {
    return this._aenigma.encrypt(data).mergeMap((value: EncryptedValue) => {
      return this._storageProvider.store(value, identifier);
    });
  }

  /**
   * Retrieve an {@link EncryptedValue} using the provided identifier
   *
   * @param identifier  identifier to reference the provided data
   *
   * @return `Observable` containing the retrieved `EncryptedValue`
   */
  public retrieve(identifier: string): Observable<string> {
    return this._storageProvider
      .retrieve(identifier)
      .mergeMap((value: EncryptedValue) => {
        return this._aenigma.decrypt(value);
      });
  }
}

/**
 * Injectable implementation of {@link AenigmaStorageProvider} which uses the broswer-based
 * `LocalStorage` module for storage and retrieval of data
 */
@Injectable()
export class AenigmaLocalStorageProvider extends AenigmaStorageProvider {
  /**
   * See: {@link AenigmaStorageProvider}#store
   */
  public store(
    data: EncryptedValue,
    identifier: string
  ): Observable<EncryptedValue> {
    return Observable.create((observer: Observer<EncryptedValue>) => {
      localStorage.setItem(identifier, data.stringify());
      observer.next(data);
    });
  }

  /**
   * See: {@link AenigmaStorageProvider}#retrieve
   */
  public retrieve(identifier: string): Observable<EncryptedValue> {
    return Observable.create((observer: Observer<EncryptedValue>) => {
      if (localStorage.getItem(identifier) !== null) {
        observer.next(
          EncryptedValue.parse(localStorage.getItem(identifier) || '')
        );
      } else {
        observer.error(
          'Local Storage key ""' + identifier + '" does not exist.'
        );
      }
    });
  }
}

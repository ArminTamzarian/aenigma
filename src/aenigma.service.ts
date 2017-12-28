import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Observer } from 'rxjs/Observer';

import 'rxjs/Rx';

import { Aenigma } from './aenigma';

import { Credentials, EncryptedValue } from './aenigma.model';

export abstract class AenigmaStorageProvider {
  public abstract store(
    data: EncryptedValue,
    identifier: string
  ): Observable<EncryptedValue>;
  public abstract retrieve(identifier: string): Observable<EncryptedValue>;
}

@Injectable()
export class AenigmaStorageService {
  public constructor(
    private _aenigma: Aenigma,
    private _storageProvider: AenigmaStorageProvider
  ) {}

  public store(data: string, identifier: string): Observable<EncryptedValue> {
    return this._aenigma.encrypt(data).mergeMap((value: EncryptedValue) => {
      return this._storageProvider.store(value, identifier);
    });
  }

  public retrieve(identifier: string): Observable<string> {
    return this._storageProvider
      .retrieve(identifier)
      .mergeMap((value: EncryptedValue) => {
        return this._aenigma.decrypt(value);
      });
  }
}

@Injectable()
export class AenigmaLocalStorageProvider extends AenigmaStorageProvider {
  public store(
    data: EncryptedValue,
    identifier: string
  ): Observable<EncryptedValue> {
    return Observable.create((observer: Observer<EncryptedValue>) => {
      localStorage.setItem(identifier, data.stringify());
      observer.next(data);
    });
  }

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

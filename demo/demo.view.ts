import { Component, OnInit } from '@angular/core';

import {
  Aenigma,
  AenigmaUtil,
  Credentials,
  EncryptedValue,
  AenigmaStorageService,
  AenigmaLocalStorageProvider
} from '../src';

@Component({
  selector: 'aenigma-demo-view',
  templateUrl: './demo/demo.view.html'
})
export class DemoViewComponent {
  private static _CREDENTIALS_JWK_KEY: string = 'AENIGMA_CREDENTIALS_JWK';

  private _aenigma: Aenigma;
  private _encryptedStorage: AenigmaStorageService;

  private _jwk: string;
  private _plaintext: string;
  private _encrypted: string;

  constructor(private _encryptedStorageProvider: AenigmaLocalStorageProvider) {
    const jwk: any = localStorage.getItem(
      DemoViewComponent._CREDENTIALS_JWK_KEY
    );

    if (!jwk) {
      this.generate();
    } else {
      Credentials.import(
        JSON.parse(jwk)
      ).subscribe((credentials: Credentials) => {
        this.generate(credentials);
      });
    }
  }

  public generate(credentials?: Credentials): void {
    Aenigma.create(credentials).subscribe(
      (aenigma: Aenigma) => {
        localStorage.setItem(
          DemoViewComponent._CREDENTIALS_JWK_KEY,
          JSON.stringify(aenigma.credentials.key)
        );

        this._jwk = JSON.stringify(aenigma.credentials.key);
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

  public encrypt(plaintext: string): void {
    this._aenigma.encrypt(plaintext).subscribe((encrypted: EncryptedValue) => {
      this._encrypted = encrypted.stringify();
    });
  }

  public decrypt(ciphertext: string): void {
    const encrypted: EncryptedValue = EncryptedValue.parse(ciphertext);

    this._aenigma.decrypt(encrypted).subscribe((decrypted: string) => {
      this._plaintext = decrypted;
    });
  }
}

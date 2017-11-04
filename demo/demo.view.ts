import { Component, OnInit } from '@angular/core';

import {
  Aenigma,
  AenigmaUtil,
  EncryptedValue,
  AenigmaStorageService,
  AenigmaLocalStorageProvider
} from '../src';

@Component({
  selector: 'aenigma-demo-view',
  templateUrl: './demo/demo.view.html'
})
export class DemoViewComponent {
  private _aenigma: Aenigma;
  private _encryptedStorage: AenigmaStorageService;

  private _jwk: string;
  private _plaintext: string;
  private _encrypted: string;

  constructor(private _encryptedStorageProvider: AenigmaLocalStorageProvider) {
    Aenigma.create().subscribe(
      (aenigma: Aenigma) => {
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

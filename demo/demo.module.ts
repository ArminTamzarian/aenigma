import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AenigmaModule, AenigmaLocalStorageProvider } from '../src';

import { DemoViewComponent } from './demo.view';

@NgModule({
  declarations: [DemoViewComponent],
  imports: [BrowserModule, FormsModule, AenigmaModule.forRoot()],
  providers: [AenigmaLocalStorageProvider],
  bootstrap: [DemoViewComponent]
})
export class DemoModule {}

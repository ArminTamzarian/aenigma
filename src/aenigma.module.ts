import { CommonModule } from '@angular/common';

import { NgModule, ModuleWithProviders } from '@angular/core';

import { AenigmaStorageService } from './aenigma.service';

@NgModule({
  imports: [CommonModule]
})
export class AenigmaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AenigmaModule,
      providers: [AenigmaStorageService]
    };
  }
}

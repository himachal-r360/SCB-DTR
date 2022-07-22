import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { RedirectPopupModule } from 'src/app/redirect-popup/redirect-popup.module';
@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,RedirectPopupModule
  ],
  exports: [FooterComponent],
})
export class FooterModule { }

import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ForyouTabComponent, TravelSheetBottomComponent} from './foryou-tab.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TravelSearchModule } from '../travel-search/travel-search.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ForyouTabRoutes } from './foryou-tab.routes';
import { RedirectPopupModule } from '../redirect-popup/redirect-popup.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MaterialModule} from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from '@ngneat/input-mask';

@NgModule({
  imports: [
   CommonModule,
    CarouselModule,
    TravelSearchModule,RedirectPopupModule,
    NgbModule,
    MatFormFieldModule,MaterialModule,
    RouterModule.forChild(ForyouTabRoutes),
    ReactiveFormsModule,
    InputMaskModule
  ],
  declarations: [ForyouTabComponent, TravelSheetBottomComponent],
   exports: [ForyouTabComponent],
   schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
   entryComponents: [TravelSheetBottomComponent]
})
export class ForyouTabModule {}

import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../material.module';
import { BannersComponent } from './banners/banners.component';
import { TravelComponent } from './travel/travel.component';
import { ExclusiveComponent } from './exclusive/exclusive.component';
import { BrandsComponent } from './brands/brands.component';
import { DealsComponent } from './deals/deals.component';
import { BenefitsComponent } from './benefits/benefits.component';





@NgModule({
  declarations: [
    BannersComponent,
    TravelComponent,
    ExclusiveComponent,
    BrandsComponent,
    DealsComponent,
    BenefitsComponent,
  
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CarouselModule,
    NgbModule,
    MatFormFieldModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  exports: [BannersComponent, TravelComponent, ExclusiveComponent, BrandsComponent, DealsComponent, BenefitsComponent ],

})
export class SharedComponentsModule { }

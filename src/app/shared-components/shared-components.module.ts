import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule
  ],
  exports: [BannersComponent, TravelComponent, ExclusiveComponent, BrandsComponent, DealsComponent, BenefitsComponent ],

})
export class SharedComponentsModule { }

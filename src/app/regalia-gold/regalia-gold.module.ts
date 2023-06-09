import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegaliaGoldHomeComponent } from './regalia-gold-home/regalia-gold-home.component';
import { RegaliaGoldBenefitsComponent } from './regalia-gold-benefits/regalia-gold-benefits.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { BannersComponent } from '../shared-components/banners/banners.component';


const routes: Routes = [
  /* {
    path:"regalia_gold" ,component:RegaliaGoldHomeComponent,
  }, */
  {
    path:"regalia_gold/know-your-card" ,component:RegaliaGoldBenefitsComponent
  },
  
  

];

@NgModule({
  declarations: [
    RegaliaGoldHomeComponent,
    RegaliaGoldBenefitsComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule.forChild(routes)
  ],
exports: [RouterModule],
providers: [ ],
})
export class RegaliaGoldModule { }

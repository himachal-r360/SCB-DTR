import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { BannersComponent } from './../shared-components/banners/banners.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { UnificationHomeComponent } from './unification-home/unification-home.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { ClubMarriotMembershipComponent } from './club-marriot-membership/club-marriot-membership.component';
import { InfiniaHomeComponent } from './infinia-home/infinia-home.component';
import { InfiniaItcHotelComponent } from './infinia-itc-hotel/infinia-itc-hotel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


const routes: Routes = [
  {
    path: "regalia_gold", component: UnificationHomeComponent,
  },
  {
    path: "infinia", component: UnificationHomeComponent,
  },
  {
    path: "diners", component: UnificationHomeComponent,
  },
  {
    path: "infinia/know-your-card", component: BenefitsComponent
  },
  { path: "infinia/infinia-itc-hotel", component: InfiniaItcHotelComponent },
  { path: "infinia/club-marriott-membership", component: ClubMarriotMembershipComponent },
  { path: "infinia/infinia-gateway", component: InfiniaHomeComponent },

];

@NgModule({
  declarations: [
    UnificationHomeComponent,
    BenefitsComponent,
    ClubMarriotMembershipComponent,
    InfiniaHomeComponent,
    InfiniaItcHotelComponent
    
    
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    /* RouterModule.forChild(routes) */
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
    CarouselModule
  ],
exports: [RouterModule],
providers:[ {
  provide: RouteReuseStrategy,
  useClass: CustomReuseStrategy,
}],
})
export class UnificationModule { }

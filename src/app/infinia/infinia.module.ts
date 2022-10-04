import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniaHomeComponent } from './infinia-home/infinia-home.component';
import { InfiniaItcHotelComponent } from './infinia-itc-hotel/infinia-itc-hotel.component';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { ClubMarriotMembershipComponent } from './club-marriot-membership/club-marriot-membership.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
const routes: Routes = [
  {path:"infinia/infinia-itc-hotel",component:InfiniaItcHotelComponent},
  {path:"infinia/club-marriott-membership" , component:ClubMarriotMembershipComponent},
  {path:"infinia/infinia-gateway" , component:InfiniaHomeComponent},

  
]


@NgModule({
  declarations: [
    InfiniaHomeComponent,
    InfiniaItcHotelComponent,
    ClubMarriotMembershipComponent
  ],
  imports: [
    CommonModule,
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
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class InfiniaModule { }

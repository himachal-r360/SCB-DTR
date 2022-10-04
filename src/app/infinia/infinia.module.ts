import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomReuseStrategy } from '../route-reuse-strategy';

import { CarouselModule } from 'ngx-owl-carousel-o';
// const routes: Routes = [
//   {path:"infinia/infinia-itc-hotel",component:InfiniaItcHotelComponent},
//   {path:"infinia/club-marriott-membership" , component:ClubMarriotMembershipComponent},
//   {path:"infinia/infinia-gateway" , component:InfiniaHomeComponent},

  
// ]


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    // RouterModule.forRoot(routes, {
    //   scrollPositionRestoration: 'enabled',
    //   anchorScrolling: 'enabled',
    //   onSameUrlNavigation: 'reload'
    // }),
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

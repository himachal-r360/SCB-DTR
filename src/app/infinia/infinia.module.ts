import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniaHomeComponent } from './infinia-home/infinia-home.component';
import { InfiniaItcHotelComponent } from './infinia-itc-hotel/infinia-itc-hotel.component';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomReuseStrategy } from '../route-reuse-strategy';
const routes: Routes = [
  {path:"infinia-itc-hotel",component:InfiniaItcHotelComponent},
  
]


@NgModule({
  declarations: [
    InfiniaHomeComponent,
    InfiniaItcHotelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
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

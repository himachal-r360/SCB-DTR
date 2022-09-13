import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchModule } from './hotel-search/hotel-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { InputMaskModule } from '@ngneat/input-mask';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

const routes: Routes = [
  {path:"hotel-list",component:HotelListComponent},
  {path:"hotel-detail",component:HotelDetailComponent}
]

@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent
  ],
  imports: [
    CommonModule,
    InputMaskModule,
    HotelSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
    NgxSliderModule,
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
export class HotelModule { }

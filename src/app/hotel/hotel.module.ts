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
import { HotelCheckoutComponent } from './hotel-checkout/hotel-checkout.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HotelDropdownDirective } from '../directives/hoteldropdown.directive';
import { DirectiveModule } from '../directives/directive.module';
import { CountdownModule } from 'ngx-countdown';
import { NgxSpinnerModule } from "ngx-spinner";
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { PaymentModule } from 'src/app/payment/payment.module';
import { AmenitiesFilterPipe } from '../pipes/amenities-filter.pipe';
import { HotelBookingRetryComponent } from './hotel-booking-retry/hotel-booking-retry.component';


const routes: Routes = [
  {path:"hotel-list",component:HotelListComponent},
  {path:"hotel-detail",component:HotelDetailComponent},
  {path:"hotel-checkout",component:HotelCheckoutComponent},
    {
    path:"hotel-booking/retry" ,component:HotelBookingRetryComponent,

  },{
    path:"regalia_gold/hotel-list" ,component:HotelListComponent,
  },{
    path:"regalia_gold/hotel-detail" ,component:HotelDetailComponent,
  },{
    path:"regalia_gold/hotel-checkout" ,component:HotelCheckoutComponent,
  },{
    path:"regalia_gold/hotel-booking/retry" ,component:HotelBookingRetryComponent,
  },
]

@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent,
    HotelCheckoutComponent,
    AmenitiesFilterPipe,HotelBookingRetryComponent
  ],
  imports: [
    CommonModule,
    InputMaskModule,
    HotelSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,CountdownModule,NgxSpinnerModule,CouponsModule,PaymentModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
    NgxSliderModule,
    CarouselModule,
    NgxSkeletonLoaderModule,
    DirectiveModule
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

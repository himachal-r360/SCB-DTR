import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { MaterialModule } from '../material.module';
import { DirectiveModule } from '../directives/directive.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { FlightRoundtripListComponent } from './flight-roundtrip-list/flight-roundtrip-list.component';
import { AgePipe } from 'src/app/pipes/age.pipe';
import { CountdownModule } from 'ngx-countdown';
const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  },
  
   {
    path:"flight-checkout" ,component:FlightCheckoutComponent
  },
  {
    path:"flight-roundtrip" ,component:FlightRoundtripListComponent
  }
  

];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe,
    FlightCheckoutComponent,
    MinuteSecondPipe,
    FlightRoundtripListComponent,AgePipe

  ],
  imports: [
        CommonModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        DirectiveModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,
        CouponsModule,PaymentModule,CountdownModule,
          RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [ ]
})
export class FlightModule { }

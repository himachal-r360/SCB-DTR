import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes,RouteReuseStrategy } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { MaterialModule } from '../material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';
import { FlightBookingRetryComponent } from './flight-booking-retry/flight-booking-retry.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { FlightRoundtripListComponent } from './flight-roundtrip-list/flight-roundtrip-list.component';
import { FlightIntListComponent } from './flight-int-list/flight-int-list.component';
import { FlightSearchModule } from './flight-search/flight-search.module';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { AgePipe } from 'src/app/pipes/age.pipe';
import { FilterPipe } from 'src/app/shared/pipes/filterUnique.pipe';
import { couponDiplayPipe } from 'src/app/shared/pipes/couponDiplay.pipe';
import { CountdownModule } from 'ngx-countdown';
import { DirectiveModule } from '../directives/directive.module';
import { TotalDurationTimePipe } from '../pipes/total-duration-time.pipe';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safeHtml.pipe';
import { AirlinesPipe } from '../pipes/airlines.pipe';
import { MultiAirlinesPipe } from '../pipes/multi_airlines.pipe';
import { FlightMulticityComponent } from './flight-multicity/flight-multicity.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { LogInComponent } from './Auth/log-in/log-in.component';

const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent,
  },

   {
    path:"flight-checkout" ,component:FlightCheckoutComponent,
  },
  {
    path:"flight-roundtrip" ,component:FlightRoundtripListComponent,
  },
  {
    path:"flight-int" ,component:FlightIntListComponent
  },
  {
    path:"flight-multicity" ,component:FlightMulticityComponent
  },
  {
    path:":domain/flight-list" ,component:FlightListComponent,
  },
   {
    path:":domain/flight-checkout" ,component:FlightCheckoutComponent,
  },
  {
    path:":domain/flight-roundtrip" ,component:FlightRoundtripListComponent,
  },
  {
    path:":domain/flight-int" ,component:FlightIntListComponent
  },
  {
    path:":domain/flight-multicity" ,component:FlightMulticityComponent
  },
  {
    path:"flight-booking/retry" ,component:FlightBookingRetryComponent,

  },{
    path:"login" ,component:LogInComponent,

  },{
    path:"sign-up" ,component:SignUpComponent,

  }



];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe,
    FlightCheckoutComponent,FlightBookingRetryComponent,
    MinuteSecondPipe,
    FlightRoundtripListComponent,FlightIntListComponent,AgePipe,FilterPipe, FlightMulticityComponent,couponDiplayPipe,TotalDurationTimePipe,SafeHtmlPipe,AirlinesPipe,MultiAirlinesPipe,  SignUpComponent, LogInComponent

  ],
  imports: [
        CommonModule,NgxSpinnerModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,FlightSearchModule,
        CouponsModule,PaymentModule,CountdownModule,
        DirectiveModule,
            RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
  ],
})
export class FlightModule { }

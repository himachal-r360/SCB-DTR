import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusNewlistComponent,ChromeExtBusDialog} from './bus-list/bus-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes,RouteReuseStrategy } from '@angular/router';
import { MaterialModule } from '../material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { BusSearchModule } from './bus-search/bus-search.module';
import { CustomReuseStrategy } from 'src/app/route-reuse-strategy';
import { CountdownModule } from 'ngx-countdown';
import { MatDialogModule } from '@angular/material/dialog';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { ListModule } from './list-card/list-card.module';
import { BusfilterPipe } from 'src/app/shared/pipes/busfilter.pipe';
import { BusCheckoutComponent } from './bus-checkout/bus-checkout.component';
import { DecimalPipe } from '@angular/common';
import { CheckoutBottomSheetComponent } from './bus-checkout/bottom-sheet/bottom-sheet.component';
import { NgxSpinnerModule } from "ngx-spinner";

const routes: Routes = [
  {
    path:"bus/search" ,component:BusNewlistComponent,
  },
  {
    path:"bus/checkout" ,component:BusCheckoutComponent,
  },
  {
    path:":domain/bus/search" ,component:BusNewlistComponent,
  },
  {
    path:":domain/bus/checkout" ,component:BusCheckoutComponent,
  },
  
  {
    path:"buses/search" ,component:BusNewlistComponent,
  }

];

@NgModule({
  declarations: [
    BusNewlistComponent,CheckoutBottomSheetComponent,ChromeExtBusDialog,BusfilterPipe,BusCheckoutComponent

  ],
  imports: [
        CommonModule,MatDialogModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,BusSearchModule,
        CouponsModule,PaymentModule,CountdownModule,
        ListModule,
        RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),NgxSpinnerModule
  ],
  
  exports: [RouterModule],
    entryComponents:[CheckoutBottomSheetComponent,ChromeExtBusDialog],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },BusHelper,DecimalPipe,
     {provide: APP_CONFIG, useValue: AppConfig},
  ],
})
export class BusModule { }

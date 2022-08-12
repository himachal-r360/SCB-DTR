import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuslistComponent,BottomSortbySheet,ChromeExtBusDialog} from './buslist/buslist.component';
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
import { DirectiveModule } from 'src/app/directives/directive.module';
import { BottomSheetComponent } from './buslist/bottom-sheet/bottom-sheet.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { ListModule } from './list-card/list-card.module';
import { FilterModule } from './filter/filter.module';
import { BusfilterPipe } from 'src/app/shared/pipes/busfilter.pipe';
const routes: Routes = [
  {
    path:"bus/search" ,component:BuslistComponent,data: {  shouldReuse: true, },
  }




];

@NgModule({
  declarations: [
    BuslistComponent,BottomSortbySheet,BottomSheetComponent,ChromeExtBusDialog,BusfilterPipe

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
        DirectiveModule,ListModule,FilterModule,
        RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
    entryComponents:[BottomSortbySheet,BottomSheetComponent,ChromeExtBusDialog],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },BusHelper,
     {provide: APP_CONFIG, useValue: AppConfig},
  ],
})
export class BusModule { }

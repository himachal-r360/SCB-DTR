import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { OrdersRetryComponent } from '../orders-retry/orders-retry.component';



@NgModule({
  declarations: [
    OrdersRetryComponent
  
  ],
  imports: [
    CommonModule,
    RouterModule
  ]

})
export class OrdersRetryModule { }

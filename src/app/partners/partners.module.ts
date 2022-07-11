import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { Routes, RouterModule } from '@angular/router';
import {PartnersRoutes } from './partners.routes';
@NgModule({
  declarations: [PartnersComponent],
  imports: [
    CommonModule,
     RouterModule.forChild(PartnersRoutes),
  ],
  exports: [PartnersComponent],
})
export class PartnersModule { }

